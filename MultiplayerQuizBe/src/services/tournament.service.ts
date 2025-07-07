import { Tournament, TournamentParticipant, TournamentStatus, TournamentType } from '../models/tournament.model';
import { User } from '../models/user.model';

export class TournamentService {
  async createTournament(data: {
    name: string;
    description?: string;
    type?: TournamentType;
    maxParticipants: number;
    startDate: Date;
    quizId: number;
    creatorId: number;
    isPublic?: boolean;
    settings?: any;
  }) {
    return Tournament.create({
      ...data,
      status: TournamentStatus.UPCOMING,
      type: data.type || TournamentType.SINGLE_ELIMINATION,
      currentParticipants: 0,
      isPublic: data.isPublic ?? false,
    });
  }

  async getAllTournaments() {
    return Tournament.findAll({
      include: [TournamentParticipant, User],
      order: [['createdAt', 'DESC']],
    });
  }

  async getTournamentById(id: number) {
    return Tournament.findByPk(id, {
      include: [TournamentParticipant, User],
    });
  }

  async updateTournament(id: number, updates: Partial<Tournament>) {
    const tournament = await Tournament.findByPk(id);
    if (!tournament) throw new Error('Tournament not found');
    await tournament.update(updates);
    return tournament;
  }

  async deleteTournament(id: number) {
    const tournament = await Tournament.findByPk(id);
    if (!tournament) throw new Error('Tournament not found');
    await tournament.destroy();
    return { message: 'Tournament deleted successfully' };
  }

  async joinTournament(tournamentId: number, userId: number) {
    const tournament = await Tournament.findByPk(tournamentId);
    if (!tournament) throw new Error('Tournament not found');
    if (tournament.currentParticipants >= tournament.maxParticipants) {
      throw new Error('Tournament is full');
    }
    // Prevent duplicate join
    const existing = await TournamentParticipant.findOne({ where: { tournamentId, userId } });
    if (existing) throw new Error('User already joined');
    await TournamentParticipant.create({ tournamentId, userId });
    await tournament.update({ currentParticipants: tournament.currentParticipants + 1 });
    return { message: 'Joined tournament successfully' };
  }

  async startTournament(id: number) {
    const tournament = await Tournament.findByPk(id);
    if (!tournament) throw new Error('Tournament not found');
    if (tournament.status !== TournamentStatus.UPCOMING && tournament.status !== TournamentStatus.REGISTRATION) {
      throw new Error('Tournament cannot be started');
    }
    await tournament.update({ status: TournamentStatus.ACTIVE });
    return tournament;
  }
}

export const tournamentService = new TournamentService(); 