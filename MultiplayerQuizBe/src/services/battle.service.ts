import { Battle, BattleParticipant, BattleQuestion, BattleStatus } from '../models/battle.model';
import { Tournament, TournamentParticipant } from '../models/tournament.model';
import { Question } from '../models/question.model';
import { Quiz } from '../models/quiz.model';
import { User } from '../models/user.model';
import { socketService } from './socket.service';

export enum BattleResult {
  PLAYER1_WIN = 'PLAYER1_WIN',
  PLAYER2_WIN = 'PLAYER2_WIN',
  DRAW = 'DRAW'
}

export class BattleService {
  // Create a new battle between two participants
  async createBattle(tournamentId: number, player1Id: number, player2Id: number, round: number) {
    console.log('🏗️ Creating battle:', { tournamentId, player1Id, player2Id, round });
    
    const tournament = await Tournament.findByPk(tournamentId, {
      include: [{ model: Quiz, include: [Question] }]
    });

    if (!tournament) {
      throw new Error('Tournament not found');
    }

    console.log('📋 Tournament found:', tournament.name);

    if (!tournament.quiz || !tournament.quiz.questions || tournament.quiz.questions.length === 0) {
      throw new Error('Tournament quiz has no questions');
    }

    console.log('❓ Quiz questions found:', tournament.quiz.questions.length);

    // Get random questions for the battle
    const questions = this.getRandomQuestions(tournament.quiz.questions, 5); // 5 questions per battle

    console.log('🎯 Selected questions for battle:', questions.length);

    const battle = await Battle.create({
      name: `Battle Round ${round}`,
      status: BattleStatus.SCHEDULED,
      type: 'TOURNAMENT',
      quizId: tournament.quizId,
      tournamentId,
      round,
      settings: {
        timeLimit: tournament.settings?.timeLimit || 30,
        questionsCount: questions.length,
        allowSpectators: tournament.settings?.allowSpectators || false,
        autoStart: tournament.settings?.autoStart || false
      }
    });

    console.log('⚔️ Battle created:', battle.id);

    // Create battle participants
    await BattleParticipant.create({
      battleId: battle.id,
      userId: player1Id,
      score: 0,
      isReady: false
    });

    await BattleParticipant.create({
      battleId: battle.id,
      userId: player2Id,
      score: 0,
      isReady: false
    });

    console.log('👥 Battle participants created');

    // Create battle questions
    for (let i = 0; i < questions.length; i++) {
      await BattleQuestion.create({
        battleId: battle.id,
        questionText: questions[i].text,
        options: questions[i].options.map(opt => ({
          text: opt.text,
          isCorrect: opt.isCorrect
        })),
        correctAnswer: questions[i].options.find(opt => opt.isCorrect)?.text || '',
        order: i + 1,
        timeLimit: tournament.settings?.timeLimit || 30
      });
    }

    console.log('❓ Battle questions created');

    // Broadcast battle creation to tournament room
    if (socketService) {
      const battles = await this.getTournamentBattles(tournamentId);
      socketService.broadcastBracketUpdate(tournamentId, battles);
    }

    return battle;
  }

  // Get all battles for a tournament
  async getTournamentBattles(tournamentId: number) {
    return Battle.findAll({
      where: { tournamentId },
      include: [
        {
          model: BattleParticipant,
          include: [{ model: User, attributes: ['id', 'name', 'email'] }]
        },
        {
          model: BattleQuestion,
          order: [['order', 'ASC']]
        }
      ],
      order: [['round', 'ASC'], ['createdAt', 'ASC']]
    });
  }

  // Get a specific battle
  async getBattleById(battleId: number) {
    return Battle.findByPk(battleId, {
      include: [
        {
          model: BattleParticipant,
          include: [{ model: User, attributes: ['id', 'name', 'email'] }]
        },
        {
          model: BattleQuestion,
          order: [['order', 'ASC']]
        }
      ]
    });
  }

  // Start a battle
  async startBattle(battleId: number) {
    const battle = await Battle.findByPk(battleId);
    if (!battle) {
      throw new Error('Battle not found');
    }

    if (battle.status !== BattleStatus.SCHEDULED && battle.status !== BattleStatus.WAITING) {
      throw new Error('Battle cannot be started');
    }

    await battle.update({
      status: BattleStatus.ACTIVE,
      startedAt: new Date()
    });

    // Broadcast battle started
    if (socketService) {
      socketService.broadcastBattleStarted(battleId);
      socketService.broadcastBattleUpdate({
        battleId,
        status: BattleStatus.ACTIVE
      });
    }

    return battle;
  }

  // Submit an answer for a battle
  async submitAnswer(battleId: number, userId: number, questionNumber: number, answer: string) {
    const battle = await Battle.findByPk(battleId, {
      include: [
        { model: BattleParticipant, where: { userId } },
        { model: BattleQuestion, where: { order: questionNumber } }
      ]
    });

    if (!battle) {
      throw new Error('Battle not found');
    }

    if (battle.status !== BattleStatus.ACTIVE) {
      throw new Error('Battle is not active');
    }

    const participant = battle.participants[0];
    const question = battle.questions[0];

    if (!participant || !question) {
      throw new Error('Participant or question not found');
    }

    // Check if answer is correct
    const isCorrect = answer === question.correctAnswer;
    const points = isCorrect ? 10 : 0;

    // Update participant score
    const newScore = participant.score + points;
    const newAnswers = participant.answers ? [...participant.answers, { 
      questionId: question.id, 
      answer, 
      isCorrect, 
      responseTime: 0, 
      answeredAt: new Date() 
    }] : [{ 
      questionId: question.id, 
      answer, 
      isCorrect, 
      responseTime: 0, 
      answeredAt: new Date() 
    }];

    await participant.update({
      score: newScore,
      answers: newAnswers,
      questionsAnswered: participant.questionsAnswered + 1,
      correctAnswers: participant.correctAnswers + (isCorrect ? 1 : 0)
    });

    // Broadcast score update
    if (socketService) {
      const allParticipants = await BattleParticipant.findAll({
        where: { battleId },
        order: [['id', 'ASC']]
      });
      
      if (allParticipants.length >= 2) {
        socketService.broadcastScoreUpdate(
          battleId,
          allParticipants[0].score,
          allParticipants[1].score
        );
      }
    }

    return { isCorrect, points, newScore };
  }

  // End a battle and determine winner
  async endBattle(battleId: number) {
    const battle = await Battle.findByPk(battleId, {
      include: [{ model: BattleParticipant }]
    });

    if (!battle) {
      throw new Error('Battle not found');
    }

    if (battle.status !== BattleStatus.ACTIVE) {
      throw new Error('Battle is not active');
    }

    // Get participants
    const participants = await BattleParticipant.findAll({
      where: { battleId },
      include: [{ model: User }]
    });

    if (participants.length !== 2) {
      throw new Error('Battle must have exactly 2 participants');
    }

    const [player1, player2] = participants;

    // Determine winner
    let winnerId = null;
    let result = BattleResult.DRAW;

    if (player1.score > player2.score) {
      winnerId = player1.userId;
      result = BattleResult.PLAYER1_WIN;
    } else if (player2.score > player1.score) {
      winnerId = player2.userId;
      result = BattleResult.PLAYER2_WIN;
    }

    // Update battle results
    await battle.update({
      status: BattleStatus.FINISHED,
      finishedAt: new Date(),
      results: {
        winnerId,
        loserId: winnerId === player1.userId ? player2.userId : player1.userId,
        isDraw: result === BattleResult.DRAW,
        winnerScore: winnerId === player1.userId ? player1.score : player2.score,
        loserScore: winnerId === player1.userId ? player2.score : player1.score,
        questionsAnswered: {
          player1: player1.questionsAnswered,
          player2: player2.questionsAnswered
        },
        averageResponseTime: {
          player1: player1.averageResponseTime,
          player2: player2.averageResponseTime
        }
      }
    });

    // Update tournament participant stats
    if (winnerId && battle.tournamentId) {
      const winner = await TournamentParticipant.findOne({
        where: { tournamentId: battle.tournamentId, userId: winnerId }
      });
      if (winner) {
        await winner.update({ wins: winner.wins + 1 });
      }

      const loserId = winnerId === player1.userId ? player2.userId : player1.userId;
      const loser = await TournamentParticipant.findOne({
        where: { tournamentId: battle.tournamentId, userId: loserId }
      });
      if (loser) {
        await loser.update({ losses: loser.losses + 1 });
      }
    }

    return { battle, winnerId, result };
  }

  // Generate tournament brackets (for single elimination)
  async generateBrackets(tournamentId: number) {
    console.log('🔧 Generating brackets for tournament:', tournamentId);
    
    const participants = await TournamentParticipant.findAll({
      where: { tournamentId },
      include: [{ model: User, attributes: ['id', 'name'] }]
    });

    console.log('📊 Found participants:', participants.length);

    if (participants.length < 2) {
      throw new Error('Need at least 2 participants to generate brackets');
    }

    // Shuffle participants
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const battles = [];

    console.log('🎲 Creating battles for shuffled participants...');

    // Create first round battles
    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        console.log(`⚔️ Creating battle between ${shuffled[i].userId} and ${shuffled[i + 1].userId}`);
        const battle = await this.createBattle(
          tournamentId,
          shuffled[i].userId,
          shuffled[i + 1].userId,
          1
        );
        battles.push(battle);
      }
    }

    console.log('✅ Generated battles:', battles.length);
    return battles;
  }

  // Get random questions from a quiz
  private getRandomQuestions(questions: Question[], count: number): Question[] {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, questions.length));
  }

  // Get battle statistics
  async getBattleStats(battleId: number) {
    const battle = await this.getBattleById(battleId);
    if (!battle) {
      throw new Error('Battle not found');
    }

    const totalQuestions = battle.questions.length;
    const completedQuestions = battle.questions.filter(q => q.answeredAt).length;

    return {
      battleId,
      status: battle.status,
      totalQuestions,
      completedQuestions,
      player1Score: battle.participants[0]?.score || 0,
      player2Score: battle.participants[1]?.score || 0,
      winnerId: battle.results?.winnerId || null,
      timeRemaining: this.calculateTimeRemaining(battle)
    };
  }

  // Calculate time remaining for current question
  private calculateTimeRemaining(battle: Battle): number {
    if (battle.status !== BattleStatus.ACTIVE || !battle.startedAt) {
      return 0;
    }

    const currentQuestion = battle.questions.find(q => !q.answeredAt)?.order || 1;
    const questionStartTime = new Date(battle.startedAt).getTime() + 
      ((currentQuestion - 1) * (battle.settings?.timeLimit || 30) * 1000);
    const currentTime = new Date().getTime();
    const elapsed = (currentTime - questionStartTime) / 1000;
    
    return Math.max(0, (battle.settings?.timeLimit || 30) - elapsed);
  }
}

export const battleService = new BattleService(); 