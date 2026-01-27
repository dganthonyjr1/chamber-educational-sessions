import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Upload, Video, Music, CheckCircle } from "lucide-react";

export default function Admin() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    titleEs: "",
    description: "",
    descriptionEs: "",
    videoFile: null as File | null,
    audioFile: null as File | null,
  });

  const { data: courses } = trpc.courses.list.useQuery();
  const createLesson = trpc.courses.createLesson.useMutation();
  const uploadVideoDirectly = trpc.lessons.uploadVideoDirectly.useMutation();
  const confirmVideoUpload = trpc.lessons.confirmVideoUpload.useMutation();

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !formData.videoFile) {
      toast.error("Please select a course and video file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Create the lesson with placeholder video data
      const lesson = await createLesson.mutateAsync({
        courseId: selectedCourse,
        title: formData.title,
        titleEs: formData.titleEs,
        description: formData.description,
        descriptionEs: formData.descriptionEs,
        videoData: 'data:video/mp4;base64,', // Placeholder
        videoType: 'video/mp4',
        thumbnailData: null,
      });

      toast.success("Lesson created! Uploading video...");
      setUploadProgress(10);

      // Step 2: Get upload endpoint for direct S3 upload
      const { fileKey, uploadEndpoint } = await uploadVideoDirectly.mutateAsync({
        lessonId: lesson.id,
        fileName: formData.videoFile.name,
        fileSize: formData.videoFile.size,
        mimeType: formData.videoFile.type,
      });

      setUploadProgress(20);

      // Step 3: Upload video directly to S3
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = 20 + (e.loaded / e.total) * 70; // 20-90%
          setUploadProgress(Math.round(percentComplete));
        }
      });

      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.addEventListener("load", async () => {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            resolve(result.url);
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.open("POST", uploadEndpoint);
        xhr.setRequestHeader("Content-Type", formData.videoFile!.type);
        xhr.send(formData.videoFile);
      });

      const videoUrl = await uploadPromise;
      setUploadProgress(90);

      // Step 4: Get video duration
      const duration = await getVideoDuration(formData.videoFile);

      // Step 5: Confirm upload and update lesson
      await confirmVideoUpload.mutateAsync({
        lessonId: lesson.id,
        fileKey,
        videoUrl,
        duration,
      });

      setUploadProgress(100);
      toast.success("Video uploaded successfully!");

      // Reset form
      setFormData({
        title: "",
        titleEs: "",
        description: "",
        descriptionEs: "",
        videoFile: null,
        audioFile: null,
      });
      setUploadProgress(0);
      setVideoModalOpen(false);
    } catch (error) {
      toast.error("Failed to upload video");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleAudioUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !formData.audioFile) {
      toast.error("Please select a course and audio file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Create the lesson with placeholder audio data
      const lesson = await createLesson.mutateAsync({
        courseId: selectedCourse,
        title: formData.title,
        titleEs: formData.titleEs,
        description: formData.description,
        descriptionEs: formData.descriptionEs,
        videoData: 'data:audio/mpeg;base64,', // Placeholder for audio
        videoType: 'audio/mpeg',
        thumbnailData: null,
      });

      toast.success("Lesson created! Uploading audio...");
      setUploadProgress(10);

      // Step 2: Get upload endpoint for direct S3 upload
      const { fileKey, uploadEndpoint } = await uploadVideoDirectly.mutateAsync({
        lessonId: lesson.id,
        fileName: formData.audioFile.name,
        fileSize: formData.audioFile.size,
        mimeType: formData.audioFile.type,
      });

      setUploadProgress(20);

      // Step 3: Upload audio directly to S3
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = 20 + (e.loaded / e.total) * 70; // 20-90%
          setUploadProgress(Math.round(percentComplete));
        }
      });

      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.addEventListener("load", async () => {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            resolve(result.url);
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.open("POST", uploadEndpoint);
        xhr.setRequestHeader("Content-Type", formData.audioFile!.type);
        xhr.send(formData.audioFile);
      });

      const audioUrl = await uploadPromise;
      setUploadProgress(90);

      // Step 4: Get audio duration
      const duration = await getAudioDuration(formData.audioFile);

      // Step 5: Confirm upload and update lesson
      await confirmVideoUpload.mutateAsync({
        lessonId: lesson.id,
        fileKey,
        videoUrl: audioUrl,
        duration,
      });

      setUploadProgress(100);
      toast.success("Audio uploaded successfully!");

      // Reset form
      setFormData({
        title: "",
        titleEs: "",
        description: "",
        descriptionEs: "",
        videoFile: null,
        audioFile: null,
      });
      setUploadProgress(0);
      setAudioModalOpen(false);
    } catch (error) {
      toast.error("Failed to upload audio");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src);
        resolve(Math.round(audio.duration));
      };
      audio.src = URL.createObjectURL(file);
    });
  };

  const VideoUploadForm = () => (
    <form onSubmit={handleVideoUpload} className="space-y-6">
      {/* Course Selection */}
      <div>
        <Label>Select Course</Label>
        <select
          className="w-full bg-background border border-border rounded-lg p-3 mt-2 text-foreground"
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
          className="bg-background border-border mt-2"
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
          className="bg-background border-border mt-2"
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
          className="bg-background border-border mt-2"
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
          className="bg-background border-border mt-2"
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
        <Label>Video File (Supports up to 60+ minutes / 4GB)</Label>
        <div className="mt-2 border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
          <Video className="w-12 h-12 mx-auto mb-2 text-primary" />
          <Input
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
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
            <p className="mt-2 text-sm text-accent">
              {formData.videoFile.name} (
              {(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading video...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:opacity-90"
        disabled={uploading}
      >
        {uploading ? (
          <>Uploading... {uploadProgress}%</>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Upload Lesson & Video
          </>
        )}
      </Button>
    </form>
  );

  const AudioUploadForm = () => (
    <form onSubmit={handleAudioUpload} className="space-y-6">
      {/* Course Selection */}
      <div>
        <Label>Select Course</Label>
        <select
          className="w-full bg-background border border-border rounded-lg p-3 mt-2 text-foreground"
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
          className="bg-background border-border mt-2"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="Audio Lesson Title"
          required
        />
      </div>

      {/* Lesson Title (Spanish) */}
      <div>
        <Label>Lesson Title (Spanish)</Label>
        <Input
          className="bg-background border-border mt-2"
          value={formData.titleEs}
          onChange={(e) =>
            setFormData({ ...formData, titleEs: e.target.value })
          }
          placeholder="Título de la Lección de Audio"
          required
        />
      </div>

      {/* Description (English) */}
      <div>
        <Label>Description (English)</Label>
        <Textarea
          className="bg-background border-border mt-2"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the audio content..."
          rows={3}
          required
        />
      </div>

      {/* Description (Spanish) */}
      <div>
        <Label>Description (Spanish)</Label>
        <Textarea
          className="bg-background border-border mt-2"
          value={formData.descriptionEs}
          onChange={(e) =>
            setFormData({ ...formData, descriptionEs: e.target.value })
          }
          placeholder="Describe el contenido de audio..."
          rows={3}
          required
        />
      </div>

      {/* Audio Upload */}
      <div>
        <Label>Audio File (Supports up to 60+ minutes / 2GB)</Label>
        <div className="mt-2 border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
          <Music className="w-12 h-12 mx-auto mb-2 text-primary" />
          <Input
            type="file"
            accept="audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/aac,audio/flac"
            onChange={(e) =>
              setFormData({
                ...formData,
                audioFile: e.target.files?.[0] || null,
              })
            }
            className="hidden"
            id="audio-upload"
            required
          />
          <label htmlFor="audio-upload" className="cursor-pointer">
            <Button type="button" variant="outline" className="mt-2">
              <Upload className="w-4 h-4 mr-2" />
              Choose Audio File
            </Button>
          </label>
          {formData.audioFile && (
            <p className="mt-2 text-sm text-accent">
              {formData.audioFile.name} (
              {(formData.audioFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading audio...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:opacity-90"
        disabled={uploading}
      >
        {uploading ? (
          <>Uploading... {uploadProgress}%</>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Upload Lesson & Audio
          </>
        )}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Admin - Upload Educational Content
        </h1>

        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video Upload
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Audio Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            <Card className="bg-card border-border p-6">
              <VideoUploadForm />
            </Card>
          </TabsContent>

          <TabsContent value="audio">
            <Card className="bg-card border-border p-6">
              <AudioUploadForm />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
