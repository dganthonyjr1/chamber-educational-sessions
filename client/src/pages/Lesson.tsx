import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { LessonVideoPlayer } from "@/components/LessonVideoPlayer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const lessonId = parseInt(id || "0");

  const { data: lesson, isLoading } = trpc.lessons.get.useQuery({ id: lessonId });
  const { data: progress } = trpc.progress.get.useQuery({ lessonId });

  const handleProgressUpdate = (watchedSeconds: number) => {
    console.log(`Watched ${watchedSeconds} seconds`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading lesson...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground mb-4">Lesson not found</p>
          <Button onClick={() => setLocation("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {lesson.title}
              </h1>
              {lesson.description && (
                <p className="text-muted-foreground">{lesson.description}</p>
              )}
            </div>
            {progress?.completed && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="container py-8">
        <Card className="p-6">
          {lesson.videoUrl ? (
            <LessonVideoPlayer
              lessonId={lesson.id}
              videoUrl={lesson.videoUrl}
              onProgressUpdate={handleProgressUpdate}
            />
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                Video not available yet. Check back soon!
              </p>
            </div>
          )}

          {/* Lesson Info */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">About this lesson</h2>
            <p className="text-muted-foreground">
              {lesson.description || "No description available."}
            </p>

            {lesson.videoDuration && (
              <p className="mt-4 text-sm text-muted-foreground">
                Duration: {Math.floor(lesson.videoDuration / 60)} minutes
              </p>
            )}

            {progress && (
              <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                <p className="text-sm">
                  Progress: {Math.floor((progress.watchedSeconds / (lesson.videoDuration || 1)) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Watched {Math.floor(progress.watchedSeconds / 60)} of {Math.floor((lesson.videoDuration || 0) / 60)} minutes
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
