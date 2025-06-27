import { useState } from "react"
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

interface Question {
  id: number
  text: string
  category: string
  difficulty: string
  type: string
  status: string
  createdAt: string
  options?: string[]
  correctAnswer?: string
}

const initialQuestions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    category: "Geography",
    difficulty: "Easy",
    type: "Multiple Choice",
    status: "Active",
    createdAt: "2024-01-15",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    category: "Science",
    difficulty: "Medium",
    type: "Multiple Choice",
    status: "Active",
    createdAt: "2024-01-16",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  {
    id: 3,
    text: "Who wrote 'Romeo and Juliet'?",
    category: "Literature",
    difficulty: "Easy",
    type: "Multiple Choice",
    status: "Draft",
    createdAt: "2024-01-17",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: "William Shakespeare"
  },
]

const categories = ["Geography", "Science", "Literature", "History", "Sports", "Entertainment"]
const difficulties = ["Easy", "Medium", "Hard"]
const questionTypes = ["Multiple Choice", "True/False", "Fill in the Blank"]

export function Questions() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: "",
    category: "Geography",
    difficulty: "Easy",
    type: "Multiple Choice",
    status: "Draft",
    options: ["", "", "", ""],
    correctAnswer: ""
  })
  const { toast } = useToast()

  // Filter questions based on search and filters
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || question.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || question.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const handleAddQuestion = () => {
    if (!newQuestion.text || !newQuestion.correctAnswer) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const question: Question = {
      id: Date.now(),
      text: newQuestion.text,
      category: newQuestion.category || "Geography",
      difficulty: newQuestion.difficulty || "Easy",
      type: newQuestion.type || "Multiple Choice",
      status: newQuestion.status || "Draft",
      createdAt: new Date().toISOString().split('T')[0],
      options: newQuestion.options,
      correctAnswer: newQuestion.correctAnswer
    }

    setQuestions([...questions, question])
    setNewQuestion({
      text: "",
      category: "Geography",
      difficulty: "Easy",
      type: "Multiple Choice",
      status: "Draft",
      options: ["", "", "", ""],
      correctAnswer: ""
    })
    setIsAddDialogOpen(false)
    toast({
      title: "Success",
      description: "Question added successfully"
    })
  }

  const handleEditQuestion = () => {
    if (!selectedQuestion) return

    const updatedQuestions = questions.map(q => 
      q.id === selectedQuestion.id ? selectedQuestion : q
    )
    setQuestions(updatedQuestions)
    setIsEditDialogOpen(false)
    setSelectedQuestion(null)
    toast({
      title: "Success",
      description: "Question updated successfully"
    })
  }

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id))
    toast({
      title: "Success",
      description: "Question deleted successfully"
    })
  }

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question)
    setIsViewDialogOpen(true)
  }

  const handleEditClick = (question: Question) => {
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
    if (option && option.trim()) {
      setSelectedQuestion({ ...selectedQuestion, correctAnswer: option })
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
    newOptions[index] = value
    setSelectedQuestion({ ...selectedQuestion, options: newOptions })
    
    // If this was the correct answer, update it
    if (selectedQuestion.correctAnswer === selectedQuestion.options[index]) {
      setSelectedQuestion({ ...selectedQuestion, options: newOptions, correctAnswer: value })
    }
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
                  <Label htmlFor="category">Category</Label>
                  <Select value={newQuestion.category} onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="type">Question Type</Label>
                <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion({ ...newQuestion, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {newQuestion.type === "Multiple Choice" && (
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
              )}
              {newQuestion.type !== "Multiple Choice" && (
                <div>
                  <Label htmlFor="correct-answer">Correct Answer</Label>
                  <Input
                    id="correct-answer"
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                    placeholder="Enter the correct answer"
                  />
                </div>
              )}
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
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
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
                    <span>{question.category}</span>
                    <span>•</span>
                    <span>{question.type}</span>
                    <span>•</span>
                    <span>Created {question.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge
                    variant={question.difficulty === "Easy" ? "default" : question.difficulty === "Medium" ? "secondary" : "destructive"}
                    className={
                      question.difficulty === "Easy"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : question.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }
                  >
                    {question.difficulty}
                  </Badge>

                  <Badge
                    variant={question.status === "Active" ? "default" : "secondary"}
                    className={
                      question.status === "Active"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : ""
                    }
                  >
                    {question.status}
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
                  <Label>Category</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedQuestion.category}</p>
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedQuestion.difficulty}</p>
                </div>
              </div>
              {selectedQuestion.options && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {selectedQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-sm">{String.fromCharCode(65 + index)}.</span>
                        <span className="text-sm">{option}</span>
                        {option === selectedQuestion.correctAnswer && (
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={selectedQuestion.category} onValueChange={(value) => setSelectedQuestion({ ...selectedQuestion, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Select value={selectedQuestion.difficulty} onValueChange={(value) => setSelectedQuestion({ ...selectedQuestion, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Question Type</Label>
                <Select value={selectedQuestion.type} onValueChange={(value) => setSelectedQuestion({ ...selectedQuestion, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedQuestion.type === "Multiple Choice" && selectedQuestion.options && (
                <div className="space-y-3">
                  <Label>Options</Label>
                  {selectedQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => handleEditOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant={selectedQuestion.correctAnswer === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleEditSetCorrectAnswer(index)}
                        disabled={!option.trim()}
                        className="min-w-[120px] transition-all duration-200 hover:scale-105"
                      >
                        {selectedQuestion.correctAnswer === option ? (
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
              {selectedQuestion.type !== "Multiple Choice" && (
                <div>
                  <Label htmlFor="edit-correct-answer">Correct Answer</Label>
                  <Input
                    id="edit-correct-answer"
                    value={selectedQuestion.correctAnswer}
                    onChange={(e) => setSelectedQuestion({ ...selectedQuestion, correctAnswer: e.target.value })}
                    placeholder="Enter the correct answer"
                  />
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
