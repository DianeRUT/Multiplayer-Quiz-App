import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, Search, CheckCircle, Clock, Lock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { quizzesAPI, categoriesAPI, Quiz, Category } from "@/services/api"

export function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    categoryId: ""
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Quizzes: Fetching data...');
        const [quizzesData, categoriesData] = await Promise.all([
          quizzesAPI.getAll(),
          categoriesAPI.getAll()
        ])
        console.log('Quizzes: Received quizzes data:', quizzesData);
        console.log('Quizzes: Received categories data:', categoriesData);
        setQuizzes(quizzesData)
        setCategories(categoriesData)
      } catch (err) {
        console.error('Quizzes: Error fetching data:', err);
        setError("Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || quiz.status === statusFilter
    const matchesCategory = categoryFilter === "all" || quiz.categoryId.toString() === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLIC':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'PENDING_APPROVAL':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'PRIVATE':
        return <Lock className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLIC':
        return <Badge className="bg-green-100 text-green-800">Public</Badge>
      case 'PENDING_APPROVAL':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'PRIVATE':
        return <Badge variant="secondary">Private</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleAddQuiz = async () => {
    if (!newQuiz.title || !newQuiz.categoryId) {
      alert("Please fill in all required fields")
      return
    }
    try {
      // Find the category name from the selected category ID
      const selectedCategory = categories.find(cat => cat.id.toString() === newQuiz.categoryId)
      if (!selectedCategory) {
        alert("Selected category not found")
        return
      }

      const quizData = {
        title: newQuiz.title,
        categoryName: selectedCategory.name,
        questions: [] // Empty questions array - questions will be added later via the Questions page
      }
      console.log('Sending quiz data:', quizData)
      console.log('Questions array:', JSON.stringify(quizData.questions, null, 2))
      const res = await quizzesAPI.create(quizData)
      setQuizzes([res, ...quizzes])
      setNewQuiz({
        title: "",
        categoryId: ""
      })
      setIsAddDialogOpen(false)
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add quiz")
    }
  }

  const handleEditQuiz = async () => {
    if (!selectedQuiz) return

    try {
      const selectedCategory = categories.find(cat => cat.id === selectedQuiz.categoryId)
      if (!selectedCategory) {
        alert("Selected category not found")
        return
      }

      const quizData = {
        title: selectedQuiz.title,
        categoryName: selectedCategory.name,
        questions: selectedQuiz.questions.map(q => ({
          text: q.text,
          options: q.options.map(opt => ({
            text: opt.text,
            isCorrect: opt.isCorrect
          }))
        }))
      }
      const updatedQuiz = await quizzesAPI.update(selectedQuiz.id, quizData)
      setQuizzes(quizzes.map(quiz => 
        quiz.id === selectedQuiz.id ? updatedQuiz : quiz
      ))
      setIsEditDialogOpen(false)
      setSelectedQuiz(null)
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update quiz")
    }
  }

  const handleDeleteQuiz = async (id: number) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        await quizzesAPI.delete(id)
        setQuizzes(quizzes.filter(quiz => quiz.id !== id))
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete quiz")
      }
    }
  }

  const handleApproveQuiz = async (id: number) => {
    try {
      await quizzesAPI.approve(id)
      setQuizzes(quizzes.map(quiz => 
        quiz.id === id ? { ...quiz, status: 'PUBLIC' as const } : quiz
      ))
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve quiz")
    }
  }

  const handleViewQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsViewDialogOpen(true)
  }

  const handleEditClick = (quiz: Quiz) => {
    setSelectedQuiz({ ...quiz })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quizzes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage quiz content and settings</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Quiz</DialogTitle>
              <DialogDescription>
                Create a new quiz by filling in the title and selecting a category.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="quiz-title">Quiz Title</Label>
                <Input
                  id="quiz-title"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <Label htmlFor="quiz-category">Category</Label>
                {categories.length > 0 ? (
                  <Select value={newQuiz.categoryId} onValueChange={(value) => setNewQuiz({ ...newQuiz, categoryId: value })}>
                    <SelectTrigger id="quiz-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-gray-500">No categories available. Please create a category first.</div>
                )}
              </div>
              <Button onClick={handleAddQuiz} className="w-full">Add Quiz</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32" id="status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PUBLIC">Public</SelectItem>
            <SelectItem value="PENDING_APPROVAL">Pending</SelectItem>
            <SelectItem value="PRIVATE">Private</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40" id="category-filter">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map(quiz => (
            <Card key={quiz.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(quiz.status)}
                    <h2 className="font-bold text-lg">{quiz.title}</h2>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <span className="sr-only">Open menu</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewQuiz(quiz)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClick(quiz)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {quiz.status === 'PENDING_APPROVAL' && (
                        <DropdownMenuItem onClick={() => handleApproveQuiz(quiz.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(quiz.status)}
                  </div>
                  <p className="text-sm text-gray-500">
                    Category: {categories.find(c => c.id === quiz.categoryId)?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Questions: {quiz.questions?.length || 0}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Quiz Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quiz Details</DialogTitle>
            <DialogDescription>
              View detailed information about this quiz including questions and answers.
            </DialogDescription>
          </DialogHeader>
          {selectedQuiz && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedQuiz.status)}
                <h3 className="text-lg font-semibold">{selectedQuiz.title}</h3>
                {getStatusBadge(selectedQuiz.status)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <p className="text-sm">{categories.find(c => c.id === selectedQuiz.categoryId)?.name}</p>
                </div>
                <div>
                  <Label>Creator</Label>
                  <p className="text-sm">{selectedQuiz.creator?.name}</p>
                </div>
                <div>
                  <Label>Questions</Label>
                  <p className="text-sm">{selectedQuiz.questions?.length || 0}</p>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-sm">{new Date(selectedQuiz.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedQuiz.questions && selectedQuiz.questions.length > 0 && (
                <div>
                  <Label>Questions</Label>
                  <div className="space-y-2 mt-2">
                    {selectedQuiz.questions.map((question, index) => (
                      <div key={index} className="border rounded p-3">
                        <p className="font-medium">{index + 1}. {question.text}</p>
                        <div className="mt-2 space-y-1">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${option.isCorrect ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              <span className={option.isCorrect ? 'font-medium' : ''}>{option.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Quiz Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Quiz</DialogTitle>
          </DialogHeader>
          {selectedQuiz && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-quiz-title">Quiz Title</Label>
                <Input
                  id="edit-quiz-title"
                  value={selectedQuiz.title}
                  onChange={(e) => setSelectedQuiz({ ...selectedQuiz, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-quiz-category">Category</Label>
                <Select 
                  value={selectedQuiz.categoryId?.toString() || ""} 
                  onValueChange={(value) => setSelectedQuiz({ ...selectedQuiz, categoryId: parseInt(value) })}
                >
                  <SelectTrigger id="edit-quiz-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditQuiz}>
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