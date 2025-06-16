import { useState } from "react"
import { X, ImageIcon, Link, Bold, Italic, List } from "lucide-react"
import { Button } from "../ForumComponents/ui/button"
import { Input } from "../ForumComponents/ui/input"
import { Textarea } from "../ForumComponents/ui/textarea"
import { Badge } from "../ForumComponents/ui/badge"
import * as Dialog from "@radix-ui/react-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ForumComponents/ui/select"
import { forumAPI } from "../../services/api"


const categories = [
  "General Health",
  "Reproductive Health",
  "STI Prevention",
  "Pregnancy & Family Planning",
  "Menstrual Health",
  "Mental Health",
]

const suggestedTags = [
  "advice",
  "support",
  "question",
  "experience",
  "tips",
  "resources",
  "pregnancy",
  "contraception",
  "testing",
  "symptoms",
  "treatment",
  "mental-health",
  "anxiety",
  "depression",
  "relationships",
]

export function CreatePostModal({ isOpen, onClose }) {
  // console.log("Dialog isOpen:", isOpen); 
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false);


  const addTag = (tag) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit =  async () => {
      setLoading(true);
    try{
      const accountId = "684a1ac7dfae966e9818e257";
      const postData = {
        title,
        content,
        category,
        tags,
        accountId
      }
      const response = await forumAPI.createPost(postData)
      console.log("Post created successfully:", response.data);
      onClose()
      setTitle("")
      setContent("")
      setCategory("")
      setTags([])
      // alert("Bài viết đã được tạo thành công!")
    }catch (error) {
      console.error("Error creating post:", error);
      alert("Đã xảy ra lỗi khi tạo bài viết. Vui lòng thử lại sau.")
    }

    
  }

  return (
    

      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
       <Dialog.Content className="fixed left-1/2 top-1/2 z-51 grid w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 gap-4 border bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto rounded-lg">
  <Dialog.Title className="text-xl font-semibold">Create New Discussion</Dialog.Title>
  <Dialog.Description className="text-gray-500 text-sm">
    Điền nội dung bạn muốn chia sẻ với cộng đồng.
  </Dialog.Description>
  
  <div className="space-y-6">
    <div>
      <label htmlFor="title" className="block text-sm font-medium mb-1">
        Tiêu đề
      </label>
      <Input
        id="title"
        placeholder="Nhập tiêu đề cho chủ đề thảo luận..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />
    </div>
    
   <div>
  <label htmlFor="category" className="block text-sm font-medium mb-1">
    Danh mục
  </label>
<Select value={category} onValueChange={setCategory}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Chọn danh mục" />
  </SelectTrigger>
  <SelectContent position="popper" sideOffset={5} className="z-[100]">
    {categories.map((cat) => (
      <SelectItem key={cat} value={cat}>
        {cat}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

</div>

    
    <div>
      <label htmlFor="content" className="block text-sm font-medium mb-1">
        Nội dung
      </label>
      <div className="border rounded-md mb-2">
        <div className="flex items-center gap-1 border-b p-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Bold className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Italic className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <List className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Link className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>
        <Textarea
          id="content"
          placeholder="Viết nội dung câu hỏi hoặc thảo luận của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-none resize-none focus-visible:ring-0"
          rows={8}
        />
      </div>
    </div>
    
    <div>
      <label className="block text-sm font-medium mb-1">Tags (tối đa 5)</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1 hover:bg-gray-200 rounded-full">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {suggestedTags.map((tag) => (
          !tags.includes(tag) && (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => addTag(tag)}
            >
              + {tag}
            </Badge>
          )
        ))}
      </div>
    </div>
    
    {/* <div className="flex items-center">
      <input
        type="checkbox"
        id="anonymous"
        checked={isAnonymous}
        onChange={(e) => setIsAnonymous(e.target.checked)}
        className="mr-2"
      />
      <label htmlFor="anonymous" className="text-sm">
        Đăng ẩn danh
      </label>
    </div> */}
    
    <div className="flex justify-end gap-2">
      <Dialog.Close asChild>
        <Button variant="outline">Hủy</Button>
      </Dialog.Close>
      <Button onClick={handleSubmit}>Đăng bài</Button>
    </div>
  </div>
  
  <Dialog.Close asChild>
    <button className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  </Dialog.Close>
</Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
