// pages/api/execute-code.ts or app/api/execute-code/route.ts (depending on your Next.js version)

import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface ExecutionResult {
    output?: string;
    error?: string;
    executionTime?: number;
}

// For App Router (Next.js 13+)
export async function POST(request: Request) {
    try {
        const { code, language } = await request.json();
        
        if (!code || !language) {
            return Response.json({ error: 'Code and language are required' }, { status: 400 });
        }

        const result = await executeCode(code, language);
        return Response.json(result);
    } catch (error) {
        console.error('Execution error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}



async function executeCode(code: string, language: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const tempDir = path.join(process.cwd(), 'temp');
    const fileId = uuidv4();

    try {
        // Ensure temp directory exists
        await fs.mkdir(tempDir, { recursive: true });

        let command: string;
        let fileName: string;

        switch (language) {
            case 'python':
                fileName = `${fileId}.py`;
                await fs.writeFile(path.join(tempDir, fileName), code);
                command = `cd ${tempDir} && python3 ${fileName}`;
                break;

            case 'javascript':
                fileName = `${fileId}.js`;
                await fs.writeFile(path.join(tempDir, fileName), code);
                command = `cd ${tempDir} && node ${fileName}`;
                break;

            case 'java':
                // Extract class name from code
                const classMatch = code.match(/public\s+class\s+(\w+)/);
                const className = classMatch ? classMatch[1] : 'Main';
                fileName = `${className}.java`;
                await fs.writeFile(path.join(tempDir, fileName), code);
                command = `cd ${tempDir} && javac ${fileName} && java ${className}`;
                break;

            case 'cpp':
                fileName = `${fileId}.cpp`;
                await fs.writeFile(path.join(tempDir, fileName), code);
                command = `cd ${tempDir} && g++ -o ${fileId} ${fileName} && ${fileId}.exe`;
                break;

            default:
                return { error: 'Unsupported language' };
        }

        const result = await executeCommand(command);
        const executionTime = Date.now() - startTime;

        // Clean up files
        await cleanupFiles(tempDir, fileId, language);

        return {
            output: result.stdout || undefined,
            error: result.stderr || undefined,
            executionTime
        };

    } catch (error) {
        const executionTime = Date.now() - startTime;
        
        // Clean up files even if execution failed
        await cleanupFiles(tempDir, fileId, language);
        
        return {
            error: error instanceof Error ? error.message : 'Execution failed',
            executionTime
        };
    }
}

function executeCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
        exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error) {
                // If it's a timeout or execution error, still return the output
                resolve({ stdout, stderr: stderr || error.message });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

async function cleanupFiles(tempDir: string, fileId: string, language: string) {
    try {
        const filesToClean = [];
        
        switch (language) {
            case 'python':
                filesToClean.push(`${fileId}.py`);
                break;
            case 'javascript':
                filesToClean.push(`${fileId}.js`);
                break;
            case 'java':
                // Clean up both .java and .class files
                const files = await fs.readdir(tempDir);
                filesToClean.push(...files.filter(f => f.includes(fileId) || f.endsWith('.class')));
                break;
            case 'cpp':
                filesToClean.push(`${fileId}.cpp`, fileId); // source and executable
                break;
        }

        for (const file of filesToClean) {
            try {
                await fs.unlink(path.join(tempDir, file));
            } catch (e) {
                // Ignore cleanup errors
            }
        }
    } catch (e) {
        // Ignore cleanup errors
    }
}