import { useState } from "react";
import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon, RotateCcwIcon, PlayIcon, LoaderIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "./ui/button";
import Editor from "@monaco-editor/react";

interface ExecutionResult {
    output?: string;
    error?: string;
    executionTime?: number;
}

function CodeEditor() {
    const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
    const [language, setLanguage] = useState<"javascript" | "python" | "java" | "cpp">(LANGUAGES[0].id);
    const [code, setCode] = useState(selectedQuestion.starterCode[language]);
    const [isRunning, setIsRunning] = useState(false);
    const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
    const { isInterviewer, isCandidate } = useUserRole();

    const handleQuestionChange = (questionId: string) => {
        const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
        setSelectedQuestion(question);
        setCode(question.starterCode[language]);
        setExecutionResult(null); // Clear previous results
    }; 

    const handleLanguageChange = (newLanguage: "javascript" | "python" | "java" | "cpp") => {
        setLanguage(newLanguage);
        setCode(selectedQuestion.starterCode[newLanguage]);
        setExecutionResult(null); // Clear previous results
    };

    const handleRefresh = () => {
        setCode(selectedQuestion.starterCode[language]);
        setExecutionResult(null); // Clear previous results
    };

    const handleRunCode = async () => {
        if (!code.trim()) return;
        
        setIsRunning(true);
        setExecutionResult(null);

        try {
            const response = await fetch('/api/execute-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code,
                    language,
                }),
            });

            const result = await response.json();
            setExecutionResult(result);
        } catch (error) {
            setExecutionResult({
                error: 'Failed to execute code. Please try again.',
            });
        } finally {
            setIsRunning(false);
        }
    };

    const getMonacoLanguage = () => {
        switch (language) {
            case 'javascript': return 'javascript';
            case 'python': return 'python';
            case 'java': return 'java';
            case 'cpp': return 'cpp';
            default: return 'javascript';
        }
    };
    
    return (
        <ResizablePanelGroup direction="vertical" className="min-h-[calc-100vh-4rem-1px]">
            <ResizablePanel>
                <ScrollArea className="h-full">
                    <div className="p-6">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-semibold tracking-tight">
                                            {selectedQuestion.title}
                                        </h2>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Choose your language and solve the problem
                                    </p>  
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button 
                                        onClick={handleRefresh} 
                                        className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors" 
                                        aria-label="Reset to default code"
                                    >
                                        <RotateCcwIcon className="size-4 text-gray-400" />
                                    </Button>

                                    {isCandidate && (
                                        <Button 
                                            onClick={handleRunCode}
                                            disabled={isRunning || !code.trim()}
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {isRunning ? (
                                                <>
                                                    <LoaderIcon className="size-4 animate-spin" />
                                                    Running...
                                                </>
                                            ) : (
                                                <>
                                                    <PlayIcon className="size-4" />
                                                    Run
                                                </>
                                            )}
                                        </Button>
                                    )}

                                    <Select value={selectedQuestion.id} onValueChange={handleQuestionChange}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select question" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CODING_QUESTIONS.map((q) => (
                                                <SelectItem key={q.id} value={q.id}>
                                                    {q.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={language} onValueChange={handleLanguageChange}>
                                        <SelectTrigger className="w-[150px]">
                                            {/* SELECT VALUE */}
                                            <SelectValue>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                    src={`/${language}.png`}
                                                    alt={language}
                                                    className="w-5 h-5 object-contain"
                                                    />
                                                    {LANGUAGES.find((l) => l.id === language)?.name}
                                                </div>
                                            </SelectValue>
                                        </SelectTrigger>
                                        {/* SELECT CONTENT */}
                                        <SelectContent>
                                            {LANGUAGES.map((lang) => (
                                                <SelectItem key={lang.id} value={lang.id}>
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                        src={`/${lang.id}.png`}
                                                        alt={lang.name}
                                                        className="w-5 h-5 object-contain"
                                                        />
                                                        {lang.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Problem Desc. */}
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <BookIcon className="h-5 w-5 text-primary/80" />
                                    <CardTitle>Problem Description</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm leading-relaxed">
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-line">{selectedQuestion.description}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Problem Examples */}
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                                    <CardTitle>Examples</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-full w-full rounded-md border">
                                        <div className="p-4 space-y-4">
                                            {selectedQuestion.examples.map((example, index) => (
                                                <div key={index} className="space-y-2">
                                                    <p className="font-medium text-sm">Example {index + 1}:</p>
                                                    <ScrollArea className="h-full w-full rounded-md">
                                                        <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono">
                                                            <div>Input: {example.input}</div>
                                                            <div>Output: {example.output}</div>
                                                            {example.explanation && (
                                                                <div className="pt-2 text-muted-foreground">
                                                                    Explanation: {example.explanation}
                                                                </div>
                                                            )}
                                                        </pre>
                                                        <ScrollBar orientation="horizontal" />
                                                    </ScrollArea>
                                                </div>
                                            ))}
                                        </div>
                                        <ScrollBar />
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            {/* Constraints */}
                            {selectedQuestion.constraints && (
                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-2">
                                        <AlertCircleIcon className="h-5 w-5 text-blue-500" />
                                        <CardTitle>Constraints</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                                            {selectedQuestion.constraints.map((constraint, index) => (
                                                <li key={index} className="text-muted-foreground">
                                                    {constraint}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                    <ScrollBar />
                </ScrollArea>
            </ResizablePanel>

            {isCandidate && <ResizableHandle withHandle/>}

            {isCandidate && (
                <ResizablePanel defaultSize={60} maxSize={100}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={70} minSize={30}>
                            <div className="h-full relative">
                                <Editor
                                    height={"100%"}
                                    defaultLanguage={getMonacoLanguage()}
                                    language={getMonacoLanguage()}
                                    theme="vs-dark"
                                    value={code}
                                    onChange={(value) => setCode(value || "")}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 18,
                                        lineNumbers: "on",
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        padding: { top: 16, bottom: 16 },
                                        wordWrap: "on",
                                        wrappingIndent: "indent",
                                    }}
                                />
                            </div>
                        </ResizablePanel>

                        <ResizableHandle withHandle/>

                        <ResizablePanel defaultSize={30} minSize={20}>
                            <div className="h-full bg-[#1e1e1e]">
                                <div className="h-full flex flex-col">
                                    <div className="px-4 py-2 bg-[#2d2d30]">
                                        <h3 className="text-sm font-medium text-gray-300">Console</h3>
                                    </div>
                                    <ScrollArea className="flex-1 p-4">
                                        {executionResult ? (
                                            <div className="space-y-2">
                                                {executionResult.output && (
                                                    <div>
                                                        <h4 className="text-xs font-medium text-green-400 mb-1">Output:</h4>
                                                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-[#0d1117] p-3 rounded border border-gray-600">
                                                            {executionResult.output}
                                                        </pre>
                                                    </div>
                                                )}
                                                {executionResult.error && (
                                                    <div>
                                                        <h4 className="text-xs font-medium text-red-400 mb-1">Error:</h4>
                                                        <pre className="text-sm text-red-300 whitespace-pre-wrap font-mono bg-red-950/20 p-3 rounded border border-red-800">
                                                            {executionResult.error}
                                                        </pre>
                                                    </div>
                                                )}
                                                {executionResult.executionTime && (
                                                    <div className="text-xs text-gray-400">
                                                        Execution time: {executionResult.executionTime}ms
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground italic">
                                                {isRunning ? "Running code..." : "Click 'Run' to execute your code"}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </div>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            )}
        </ResizablePanelGroup>
    );
};

export default CodeEditor;