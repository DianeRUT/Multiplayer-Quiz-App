// src/services/quiz.service.ts
import { sequelize } from '../config/database';
import { Quiz, QuizStatus } from '../models/quiz.model';
import { Question } from '../models/question.model';
import { Option } from '../models/option.model';
import { User, UserRole } from '../models/user.model';
import { Op } from 'sequelize'; // <-- Import Op for OR queries
import { Category } from '../models/category.model';

// --- UPDATE createQuiz ---
export const createQuiz = async (
  title: string,
  creatorId: number,
  categoryName: string, // <-- Change parameter from categoryId to categoryName
  questions: { text: string; options: { text: string; isCorrect: boolean }[] }[]
) => {
  console.log('QuizService: createQuiz called with:', { title, creatorId, categoryName, questionsCount: questions.length });
  
  // Check for duplicate quiz name globally
  const existingQuiz = await Quiz.findOne({
    where: { title: title.trim() }
  });
  
  if (existingQuiz) {
    console.log('QuizService: Duplicate quiz name found:', existingQuiz.title);
    throw new Error(`A quiz with the name "${title}" already exists. Please choose a different name.`);
  }
  
  const t = await sequelize.transaction();
  try {
    // --- USE THE NEW HELPER FUNCTION ---
    const category = await findOrCreateCategory(categoryName);
    console.log('QuizService: Found/created category:', { id: category.id, name: category.name });

    // Now use the category's ID to create the quiz
    const quiz = await Quiz.create(
        { title, creatorId, categoryId: category.id }, // <-- Use the found/created category.id
        { transaction: t }
    );
    console.log('QuizService: Created quiz:', { id: quiz.id, title: quiz.title, status: quiz.status });

    for (const q of questions) {
      const question = await Question.create(
        { text: q.text, quizId: quiz.id },
        { transaction: t }
      );
      await Option.bulkCreate(
        q.options.map(opt => ({ ...opt, questionId: question.id })),
        { transaction: t }
      );
    }

    await t.commit();
    console.log('QuizService: Quiz creation completed successfully');
    return quiz;
  } catch (error) {
    console.error('QuizService: Error creating quiz:', error);
    await t.rollback();
    throw error;
  }
};


export const findQuizzesForUser = (user: User, status?: QuizStatus, categoryId?: number) => { // <-- Add categoryId
  const whereClause: any = {};

  console.log('QuizService: findQuizzesForUser called with user:', { id: user.id, role: user.role });
  console.log('QuizService: status filter:', status);
  console.log('QuizService: categoryId filter:', categoryId);

  if (user.role === UserRole.ADMIN) {
    // Admin users can see all quizzes, optionally filtered by status
    if (status) whereClause.status = status;
    // If no status filter, show all quizzes (no where clause restriction)
  } else {
    // Non-admin users can only see their own quizzes or public ones
    whereClause[Op.or] = [
      { creatorId: user.id },
      { status: QuizStatus.PUBLIC }
    ];
  }

  // Add the category filter if it's provided
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  console.log('QuizService: Final whereClause:', JSON.stringify(whereClause, null, 2));

  return Quiz.findAll({
    where: whereClause,
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name'] },
      { model: Category, as: 'category' } 
    ],
    order: [['createdAt', 'DESC']]
  }).then(quizzes => {
    console.log('QuizService: Found quizzes:', quizzes.length);
    console.log('QuizService: Quiz IDs:', quizzes.map(q => q.id));
    return quizzes;
  });
};

export const requestQuizApproval = async (quizId: number, userId: number) => {
  const quiz = await Quiz.findOne({ where: { id: quizId, creatorId: userId } });
  if (!quiz) {
    // Throws an error if the quiz doesn't exist or doesn't belong to the user
    throw new Error('Quiz not found or you do not have permission to edit this quiz.');
  }
  quiz.status = QuizStatus.PENDING_APPROVAL;
  await quiz.save();
  return quiz;
};

export const approveQuiz = async (quizId: number) => {
  const quiz = await Quiz.findByPk(quizId);
  if (!quiz) {
    throw new Error('Quiz not found.');
  }
  quiz.status = QuizStatus.PUBLIC;
  await quiz.save();
  return quiz;
};

const findOrCreateCategory = async (name: string): Promise<Category> => {
  // Use findOne with a case-insensitive search to prevent duplicates like "Art" and "art"
  const [category, created] = await Category.findOrCreate({
    where: { name: { [Op.iLike]: name } },
    defaults: { name: name.trim() } // Use the provided name for creation
  });
  return category;
};

// --- ADD THIS NEW FUNCTION ---
/**
 * Finds a single quiz by its ID and includes all its nested data.
 * @param quizId The ID of the quiz to find.
 * @returns A promise that resolves to the Quiz object with its questions and options.
 */
export const findQuizById = async (quizId: number) => {
  const quiz = await Quiz.findByPk(quizId, {
    include: [
      // Include the questions associated with the quiz
      {
        model: Question,
        as: 'questions',
        // For each question, also include its options
        include: [
          {
            model: Option,
            as: 'options',
            // We can exclude timestamps from the options for a cleaner response
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      // Also include creator and category info
      { model: User, as: 'creator', attributes: ['id', 'name'] },
      { model: Category, as: 'category', attributes: ['id', 'name'] },
    ],
  });

  return quiz;
};

export const updateQuiz = async (
  quizId: number,
  updateData: {
    title?: string;
    questions?: { text: string; options: { text: string; isCorrect: boolean }[] }[];
    categoryName?: string;
  }
) => {
  const t = await sequelize.transaction();
  try {
    const quiz = await Quiz.findByPk(quizId, { transaction: t });
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Check for duplicate quiz name if title is being updated
    if (updateData.title && updateData.title.trim() !== quiz.title) {
      const existingQuiz = await Quiz.findOne({
        where: { 
          title: updateData.title.trim(),
          id: { [Op.ne]: quizId } // Exclude current quiz from check
        },
        transaction: t
      });
      
      if (existingQuiz) {
        throw new Error(`A quiz with the name "${updateData.title}" already exists. Please choose a different name.`);
      }
    }

    // Update basic quiz info
    if (updateData.title) {
      quiz.title = updateData.title;
    }

    if (updateData.categoryName) {
      const category = await findOrCreateCategory(updateData.categoryName);
      quiz.categoryId = category.id;
    }

    await quiz.save({ transaction: t });

    // Update questions if provided
    if (updateData.questions) {
      // Delete existing questions and options
      const existingQuestions = await Question.findAll({ where: { quizId }, transaction: t });
      for (const question of existingQuestions) {
        await Option.destroy({ where: { questionId: question.id }, transaction: t });
      }
      await Question.destroy({ where: { quizId }, transaction: t });

      // Create new questions and options
      for (const q of updateData.questions) {
        const question = await Question.create(
          { text: q.text, quizId: quiz.id },
          { transaction: t }
        );
        await Option.bulkCreate(
          q.options.map(opt => ({ ...opt, questionId: question.id })),
          { transaction: t }
        );
      }
    }

    await t.commit();
    
    // Return updated quiz with all relations
    return await findQuizById(quizId);
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const deleteQuiz = async (quizId: number) => {
  const t = await sequelize.transaction();
  try {
    const quiz = await Quiz.findByPk(quizId, { transaction: t });
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Delete all options first
    const questions = await Question.findAll({ where: { quizId }, transaction: t });
    for (const question of questions) {
      await Option.destroy({ where: { questionId: question.id }, transaction: t });
    }

    // Delete all questions
    await Question.destroy({ where: { quizId }, transaction: t });

    // Delete the quiz
    await quiz.destroy({ transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const findAllPublicQuizzes = async (status?: QuizStatus, categoryId?: number) => {
  const whereClause: any = {};

  // Only return public quizzes for non-authenticated access
  whereClause.status = QuizStatus.PUBLIC;

  // Add the category filter if it's provided
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  return Quiz.findAll({
    where: whereClause,
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name'] },
      { model: Category, as: 'category' } 
    ],
    order: [['createdAt', 'DESC']]
  });
};