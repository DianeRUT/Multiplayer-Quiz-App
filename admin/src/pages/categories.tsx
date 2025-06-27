import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Category {
  id: number
  name: string
  description: string
  questionCount: number
  color: string
  icon: string
  status: string
  createdAt: string
}

const initialCategories: Category[] = [
  {
    id: 1,
    name: "Science & Technology",
    description: "Questions about science, technology, and innovation",
    questionCount: 150,
    color: "#3B82F6",
    icon: "🔬",
    status: "Active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "History & Geography",
    description: "Historical events and geographical knowledge",
    questionCount: 120,
    color: "#10B981",
    icon: "🌍",
    status: "Active",
    createdAt: "2024-01-16",
  },
  {
    id: 3,
    name: "Entertainment",
    description: "Movies, music, TV shows, and pop culture",
    questionCount: 200,
    color: "#F59E0B",
    icon: "🎬",
    status: "Active",
    createdAt: "2024-01-17",
  },
  {
    id: 4,
    name: "Sports",
    description: "Athletics, competitions, and sports history",
    questionCount: 80,
    color: "#EF4444",
    icon: "⚽",
    status: "Draft",
    createdAt: "2024-01-18",
  },
]

const categoryColors = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Gray", value: "#6B7280" },
]

const categoryIcons = ["🔬", "🌍", "🎬", "⚽", "📚", "🎨", "🎵", "🏆", "🌍", "🚀", "💻", "🎮"]

export function Categories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    icon: "📚",
    status: "Draft"
  })

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.description) {
      alert("Please fill in all required fields")
      return
    }

    const category: Category = {
      id: Date.now(),
      name: newCategory.name,
      description: newCategory.description,
      questionCount: 0,
      color: newCategory.color,
      icon: newCategory.icon,
      status: newCategory.status,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setCategories([...categories, category])
    setNewCategory({
      name: "",
      description: "",
      color: "#3B82F6",
      icon: "📚",
      status: "Draft"
    })
    setIsAddDialogOpen(false)
  }

  const handleEditCategory = () => {
    if (!selectedCategory) return

    const updatedCategories = categories.map(category => 
      category.id === selectedCategory.id ? selectedCategory : category
    )
    setCategories(updatedCategories)
    setIsEditDialogOpen(false)
    setSelectedCategory(null)
  }

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsViewDialogOpen(true)
  }

  const handleEditClick = (category: Category) => {
    setSelectedCategory({ ...category })
    setIsEditDialogOpen(true)
  }

  const handleDeleteCategory = (id: number) => {
    if (confirm("Are you sure you want to delete this category? This will also delete all questions in this category.")) {
      setCategories(categories.filter(category => category.id !== id))
    }
  }

  const handleToggleStatus = (id: number) => {
    setCategories(categories.map(category => 
      category.id === id 
        ? { ...category, status: category.status === "Active" ? "Draft" : "Active" }
        : category
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage quiz categories and topics</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="category-description">Description</Label>
                <Textarea
                  id="category-description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Enter category description"
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category-color">Color</Label>
                  <Select value={newCategory.color} onValueChange={(value) => setNewCategory({ ...newCategory, color: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: color.value }}
                            ></div>
                            <span>{color.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category-icon">Icon</Label>
                  <Select value={newCategory.icon} onValueChange={(value) => setNewCategory({ ...newCategory, icon: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryIcons.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{icon}</span>
                            <span>Icon</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="category-status">Status</Label>
                <Select value={newCategory.status} onValueChange={(value) => setNewCategory({ ...newCategory, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>
                  Add Category
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
                placeholder="Search categories..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{category.questionCount} questions</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewCategory(category)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Category
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(category.id)}>
                          {category.status === "Active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Category
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={category.status === "Active" ? "default" : "secondary"}
                      className={
                        category.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : ""
                      }
                    >
                      {category.status}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Created {category.createdAt}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredCategories.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No categories found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Category Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Category Details</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${selectedCategory.color}15` }}
                >
                  {selectedCategory.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedCategory.name}</h3>
                  <Badge
                    variant={selectedCategory.status === "Active" ? "default" : "secondary"}
                    className={
                      selectedCategory.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : ""
                    }
                  >
                    {selectedCategory.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{selectedCategory.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Questions</Label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedCategory.questionCount}</p>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedCategory.createdAt}</p>
                </div>
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: selectedCategory.color }}
                  ></div>
                  <span className="text-sm text-gray-900 dark:text-white">{selectedCategory.color}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category-name">Category Name</Label>
                <Input
                  id="edit-category-name"
                  value={selectedCategory.name}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category-description">Description</Label>
                <Textarea
                  id="edit-category-description"
                  value={selectedCategory.description}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category-color">Color</Label>
                  <Select value={selectedCategory.color} onValueChange={(value) => setSelectedCategory({ ...selectedCategory, color: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: color.value }}
                            ></div>
                            <span>{color.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-category-icon">Icon</Label>
                  <Select value={selectedCategory.icon} onValueChange={(value) => setSelectedCategory({ ...selectedCategory, icon: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryIcons.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{icon}</span>
                            <span>Icon</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-category-status">Status</Label>
                <Select value={selectedCategory.status} onValueChange={(value) => setSelectedCategory({ ...selectedCategory, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCategory}>
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
