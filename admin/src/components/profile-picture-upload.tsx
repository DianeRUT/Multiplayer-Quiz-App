import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import { 
  Camera, 
  Upload, 
  Trash2, 
  Image as ImageIcon,
  X
} from "lucide-react"

interface ProfilePictureUploadProps {
  currentAvatar?: string
  userInitials: string
}

export function ProfilePictureUpload({ 
  currentAvatar, 
  userInitials
}: ProfilePictureUploadProps) {
  const { toast } = useToast()
  const { user, updateUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPEG, PNG, GIF).",
        variant: "destructive"
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = async () => {
    if (!previewImage) return

    setUploading(true)
    try {
      // Convert base64 to blob
      const response = await fetch(previewImage)
      const blob = await response.blob()
      
      // Create FormData
      const formData = new FormData()
      formData.append('avatar', blob, 'avatar.jpg')

      // TODO: Implement actual upload API call
      // const uploadResponse = await api.post('/users/avatar', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // })

      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update user context with the new avatar URL
      updateUser({ avatar: previewImage })

      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully.",
      })

      // Clear preview
      setPreviewImage(null)
      
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCancel = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Avatar and Upload Button */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage 
            src={previewImage || user?.avatar || currentAvatar || "/placeholder.svg?height=96&width=96"} 
            alt="Profile" 
          />
          <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Camera className="mr-2 h-4 w-4" />
            Change Photo
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <p className="text-xs text-muted-foreground">
            JPG, PNG, GIF up to 5MB
          </p>
        </div>
      </div>

      {/* Image Preview */}
      {previewImage && (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Preview</h4>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={previewImage} alt="Preview" />
                  <AvatarFallback>Preview</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    This will be your new profile picture
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRemove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drag and Drop Area */}
      {!previewImage && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop an image here, or{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-500 hover:text-blue-600 underline"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      )}
    </div>
  )
} 