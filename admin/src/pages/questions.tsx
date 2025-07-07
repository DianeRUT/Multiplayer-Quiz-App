import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, Eye, Save, X, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { questionsAPI, quizzesAPI, categoriesAPI, Question, Quiz, Category } from "@/services/api"

interface QuestionWithDetails extends Question {
  quiz?: Quiz;
  category?: Category;
}

export function Questions() {
  const [questions, setQuestions] = useState<QuestionWithDetails[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedQuiz, setSelectedQuiz] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionWithDetails | null>(null)
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    quizId: "",
    options: ["", "", "", ""],
    correctAnswer: ""
  })
  const [error, setError] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Questions: Fetching data...');
        const [questionsData, quizzesData, categoriesData] = await Promise.all([
          questionsAPI.getAll(),
          quizzesAPI.getAll(),
          categoriesAPI.getAll()
        ])
        console.log('Questions: Received questions data:', questionsData);
        console.log('Questions: Received quizzes data:', quizzesData);
        console.log('Questions: Received categories data:', categoriesData);
        setQuestions(questionsData)
        setQuizzes(quizzesData)
        setCategories(categoriesData)
      } catch (err) {
        console.error('Questions: Error fetching data:', err);
        setError("Failed to fetch data")
        toast({
          title: "Error",
          description: "Failed to load questions",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [toast])

  // Filter questions based on search and filters
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || 
      question.quiz?.category?.name === selectedCategory
    const matchesQuiz = selectedQuiz === "all" || 
      question.quiz?.id?.toString() === selectedQuiz
    return matchesSearch && matchesCategory && matchesQuiz
  })

  const handleAddQuestion = async () => {
    if (!newQuestion.text || !newQuestion.correctAnswer || !newQuestion.quizId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      const questionData = {
        text: newQuestion.text,
        quizId: parseInt(newQuestion.quizId),
        options: newQuestion.options.map((option, index) => ({
          text: option,
          isCorrect: option === newQuestion.correctAnswer
        })).filter(opt => opt.text.trim() !== "")
      }

      const createdQuestion = await questionsAPI.create(questionData)
      setQuestions([createdQuestion, ...questions])
      setNewQuestion({
        text: "",
        quizId: "",
        options: ["", "", "", ""],
        correctAnswer: ""
      })
      setIsAddDialogOpen(false)
      toast({
        title: "Success",
        description: "Question added successfully"
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add question",
        variant: "destructive"
      })
    }
  }

  const handleEditQuestion = async () => {
    if (!selectedQuestion) return

    try {
      const questionData = {
        text: selectedQuestion.text,
        options: selectedQuestion.options?.map((option, index) => ({
          text: option.text,
          isCorrect: option.isCorrect
        })) || []
      }

      const updatedQuestion = await questionsAPI.update(selectedQuestion.id, questionData)
      setQuestions(questions.map(q => 
        q.id === selectedQuestion.id ? updatedQuestion : q
      ))
      setIsEditDialogOpen(false)
      setSelectedQuestion(null)
      toast({
        title: "Success",
        description: "Question updated successfully"
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update question",
        variant: "destructive"
      })
    }
  }

  const handleDeleteQuestion = async (id: number) => {
    if (confirm("Are you sure you want to delete this question?")) {
      try {
        await questionsAPI.delete(id)
        setQuestions(questions.filter(q => q.id !== id))
        toast({
          title: "Success",
          description: "Question deleted successfully"
        })
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to delete question",
          variant: "destructive"
        })
      }
    }
  }

  const handleViewQuestion = (question: QuestionWithDetails) => {
    setSelectedQuestion(question)
    setIsViewDialogOpen(true)
  }

  const handleEditClick = (question: QuestionWithDetails) => {
    setSelectedQuestion({ ...question })
    setIsEditDialogOpen(true)
  }

  const handleSetCorrectAnswer = (optionIndex: number) => {
    const option = newQuestion.options?.[optionIndex]
    if (option && option.trim()) {
      setNewQuestion({ ...newQuestion, correctAnswer: option })
    }
  }

  const handleEditSetCorrectAnswer = (optionIndex: number) => {
    if (!selectedQuestion?.options) return
    const option = selectedQuestion.options[optionIndex]
    if (option && option.text.trim()) {
      setSelectedQuestion({ 
        ...selectedQuestion, 
        options: selectedQuestion.options.map((opt, idx) => ({
          ...opt,
          isCorrect: idx === optionIndex
        }))
      })
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(newQuestion.options || [])]
    newOptions[index] = value
    setNewQuestion({ ...newQuestion, options: newOptions })
    
    // If this was the correct answer, update it
    if (newQuestion.correctAnswer === newQuestion.options?.[index]) {
      setNewQuestion({ ...newQuestion, options: newOptions, correctAnswer: value })
    }
  }

  const handleEditOptionChange = (index: number, value: string) => {
    if (!selectedQuestion?.options) return
    const newOptions = [...selectedQuestion.options]
    newOptions[index] = { ...newOptions[index], text: value }
    setSelectedQuestion({ ...selectedQuestion, options: newOptions })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Questions</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">Manage quiz questions and content</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question-text">Question Text</Label>
                <Textarea
                  id="question-text"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  placeholder="Enter your question here..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiz">Quiz</Label>
                  <Select value={newQuestion.quizId} onValueChange={(value) => setNewQuestion({ ...newQuestion, quizId: value })}>
                    <SelectTrigger id="quiz">
                      <SelectValue placeholder="Select a quiz" />
                    </SelectTrigger>
                    <SelectContent>
                      {quizzes.map((quiz) => (
                        <SelectItem key={quiz.id} value={quiz.id.toString()}>
                          {quiz.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Options</Label>
                {newQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant={newQuestion.correctAnswer === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSetCorrectAnswer(index)}
                      disabled={!option.trim()}
                      className="min-w-[120px] transition-all duration-200 hover:scale-105"
                    >
                      {newQuestion.correctAnswer === option ? (
                        <>
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Correct
                        </>
                      ) : (
                        "Mark Correct"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddQuestion}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Question
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search questions..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48" id="filter-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
              <SelectTrigger className="w-48" id="filter-quiz">
                <SelectValue placeholder="All Quizzes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quizzes</SelectItem>
                {quizzes.map((quiz) => (
                  <SelectItem key={quiz.id} value={quiz.id.toString()}>
                    {quiz.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{question.text}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Quiz: {question.quiz?.title || 'Unknown'}</span>
                    <span>•</span>
                    <span>Category: {question.quiz?.category?.name || 'Unknown'}</span>
                    <span>•</span>
                    <span>Options: {question.options?.length || 0}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">
                    {question.quiz?.status || 'Unknown'}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewQuestion(question)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Question
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClick(question)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Question
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Question
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {filteredQuestions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No questions found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Question Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <Label>Question</Label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedQuestion.text}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quiz</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedQuestion.quiz?.title || 'Unknown'}</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedQuestion.quiz?.category?.name || 'Unknown'}</p>
                </div>
              </div>
              {selectedQuestion.options && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {selectedQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-sm">{String.fromCharCode(65 + index)}.</span>
                        <span className="text-sm">{option.text}</span>
                        {option.isCorrect && (
                          <Badge variant="default" className="text-xs">Correct</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-question-text">Question Text</Label>
                <Textarea
                  id="edit-question-text"
                  value={selectedQuestion.text}
                  onChange={(e) => setSelectedQuestion({ ...selectedQuestion, text: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label>Quiz</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedQuestion.quiz?.title || 'Unknown'}</p>
              </div>
              <div>
                <Label>Category</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedQuestion.quiz?.category?.name || 'Unknown'}</p>
              </div>
              {selectedQuestion.options && (
                <div className="space-y-3">
                  <Label>Options</Label>
                  {selectedQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option.text}
                        onChange={(e) => handleEditOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant={option.isCorrect ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleEditSetCorrectAnswer(index)}
                        disabled={!option.text.trim()}
                        className="min-w-[120px] transition-all duration-200 hover:scale-105"
                      >
                        {option.isCorrect ? (
                          <>
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Correct
                          </>
                        ) : (
                          "Mark Correct"
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditQuestion}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
