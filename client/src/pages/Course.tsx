import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, PlayCircle, CheckCircle, Lock, Trophy } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useRoute, Link } from "wouter";

export default function Course() {
  const [, params] = useRoute("/course/:id");
  const courseId = parseInt(params?.id || "1");
  const { user, isAuthenticated } = useAuth();

  const { data: course, isLoading: courseLoading } = trpc.courses.get.useQuery({ id: courseId });
  const { data: lessons, isLoading: lessonsLoading } = trpc.lessons.listByCourse.useQuery({ courseId });
  const { data: progress } = trpc.progress.getByCourse.useQuery(
    { courseId },
    { enabled: isAuthenticated }
  );

  const completedLessons = progress?.filter(p => p.progress.completed).length || 0;
  const totalLessons = lessons?.length || 0;
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-primary">
              ← Back to Academy
            </Button>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{user?.totalScore || 0}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Course Header */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <Badge variant="outline" className="text-accent border-accent mb-4">
            Course {course?.order}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course?.title}</h1>
          <p className="text-xl text-gray-300 mb-6">{course?.description}</p>

          {isAuthenticated && (
            <div className="max-w-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Your Progress</span>
                <span className="text-sm font-semibold">
                  {completedLessons} / {totalLessons} lessons
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Lessons List */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Lessons</h2>

          {lessons && lessons.length > 0 ? (
            <div className="grid gap-4">
              {lessons.map((lesson, index) => {
                const isCompleted = progress?.some(
                  p => p.progress.lessonId === lesson.id && p.progress.completed
                );

                return (
                  <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                    <Card className="bg-gray-900 border-gray-800 hover:border-primary transition-all cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Thumbnail */}
                          <div className="w-32 h-20 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {lesson.thumbnailUrl ? (
                              <img
                                src={lesson.thumbnailUrl}
                                alt={lesson.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <PlayCircle className="h-8 w-8 text-gray-600" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                  {index + 1}. {lesson.title}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                  {lesson.description || "No description available"}
                                </p>
                              </div>

                              {isCompleted ? (
                                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                              ) : isAuthenticated ? (
                                <PlayCircle className="h-6 w-6 text-accent flex-shrink-0" />
                              ) : (
                                <Lock className="h-6 w-6 text-gray-600 flex-shrink-0" />
                              )}
                            </div>

                            {lesson.videoDuration && (
                              <Badge variant="outline" className="text-xs">
                                {Math.floor(lesson.videoDuration / 60)} min
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-12 text-center">
                <p className="text-gray-400 mb-4">No lessons available yet.</p>
                <p className="text-sm text-gray-500">
                  Lessons will be added soon. Check back later!
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Quiz Section */}
        <section>
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                Course Quiz Challenge
              </CardTitle>
              <CardDescription className="text-gray-300">
                Test your knowledge and earn points!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/quiz/${courseId}`}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Take Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
