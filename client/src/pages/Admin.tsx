import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Video } from "lucide-react";

export default function Admin() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    titleEs: "",
    description: "",
    descriptionEs: "",
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
  });

  const { data: courses } = trpc.courses.list.useQuery();
  const createLesson = trpc.courses.createLesson.useMutation();

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !formData.videoFile) {
      toast.error("Please select a course and video file");
      return;
    }

    setUploading(true);
    try {
      // Convert files to base64 for upload
      const videoBase64 = await fileToBase64(formData.videoFile);
      const thumbnailBase64 = formData.thumbnailFile
        ? await fileToBase64(formData.thumbnailFile)
        : null;

      await createLesson.mutateAsync({
        courseId: selectedCourse,
        title: formData.title,
        titleEs: formData.titleEs,
        description: formData.description,
        descriptionEs: formData.descriptionEs,
        videoData: videoBase64,
        videoType: formData.videoFile.type,
        thumbnailData: thumbnailBase64,
        thumbnailType: formData.thumbnailFile?.type,
      });

      toast.success("Lesson uploaded successfully!");
      setFormData({
        title: "",
        titleEs: "",
        description: "",
        descriptionEs: "",
        videoFile: null,
        thumbnailFile: null,
      });
    } catch (error) {
      toast.error("Failed to upload lesson");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#ff006e] to-[#00d9ff] bg-clip-text text-transparent">
          Admin - Upload Course Videos
        </h1>

        <Card className="bg-[#1a1a1a] border-[#ff006e]/20 p-6">
          <form onSubmit={handleVideoUpload} className="space-y-6">
            {/* Course Selection */}
            <div>
              <Label>Select Course</Label>
              <select
                className="w-full bg-[#0a0a0a] border border-[#ff006e]/20 rounded-lg p-3 mt-2"
                value={selectedCourse || ""}
                onChange={(e) => setSelectedCourse(Number(e.target.value))}
              >
                <option value="">Choose a course...</option>
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Lesson Title (English) */}
            <div>
              <Label>Lesson Title (English)</Label>
              <Input
                className="bg-[#0a0a0a] border-[#ff006e]/20 mt-2"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Introduction to AI"
                required
              />
            </div>

            {/* Lesson Title (Spanish) */}
            <div>
              <Label>Lesson Title (Spanish)</Label>
              <Input
                className="bg-[#0a0a0a] border-[#ff006e]/20 mt-2"
                value={formData.titleEs}
                onChange={(e) =>
                  setFormData({ ...formData, titleEs: e.target.value })
                }
                placeholder="Introducción a la IA"
                required
              />
            </div>

            {/* Description (English) */}
            <div>
              <Label>Description (English)</Label>
              <Textarea
                className="bg-[#0a0a0a] border-[#ff006e]/20 mt-2"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Learn the fundamentals..."
                rows={3}
                required
              />
            </div>

            {/* Description (Spanish) */}
            <div>
              <Label>Description (Spanish)</Label>
              <Textarea
                className="bg-[#0a0a0a] border-[#ff006e]/20 mt-2"
                value={formData.descriptionEs}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionEs: e.target.value })
                }
                placeholder="Aprende los fundamentos..."
                rows={3}
                required
              />
            </div>

            {/* Video Upload */}
            <div>
              <Label>Video File (60+ minutes supported)</Label>
              <div className="mt-2 border-2 border-dashed border-[#ff006e]/20 rounded-lg p-6 text-center">
                <Video className="w-12 h-12 mx-auto mb-2 text-[#ff006e]" />
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      videoFile: e.target.files?.[0] || null,
                    })
                  }
                  className="hidden"
                  id="video-upload"
                  required
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" className="mt-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Video File
                  </Button>
                </label>
                {formData.videoFile && (
                  <p className="mt-2 text-sm text-[#00d9ff]">
                    {formData.videoFile.name} (
                    {(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <Label>Thumbnail Image (Optional)</Label>
              <div className="mt-2 border-2 border-dashed border-[#00d9ff]/20 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thumbnailFile: e.target.files?.[0] || null,
                    })
                  }
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label htmlFor="thumbnail-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" className="mt-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Thumbnail
                  </Button>
                </label>
                {formData.thumbnailFile && (
                  <p className="mt-2 text-sm text-[#00d9ff]">
                    {formData.thumbnailFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-[#ff006e] to-[#00d9ff] hover:opacity-90"
            >
              {uploading ? "Uploading..." : "Upload Lesson"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
