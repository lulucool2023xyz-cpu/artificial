/**
 * Utility functions for exporting chat conversations
 */

export interface ExportMessage {
    role: 'user' | 'model' | 'assistant';
    content: string;
    timestamp?: string;
}

export interface ExportOptions {
    format: 'markdown' | 'json' | 'txt';
    includeTimestamps?: boolean;
    title?: string;
}

/**
 * Export chat messages to a downloadable file
 */
export function exportChat(
    messages: ExportMessage[],
    options: ExportOptions
): void {
    const { format, includeTimestamps = true, title = 'Chat Export' } = options;

    let content: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
        case 'markdown':
            content = formatAsMarkdown(messages, title, includeTimestamps);
            mimeType = 'text/markdown';
            extension = 'md';
            break;
        case 'json':
            content = formatAsJson(messages, title);
            mimeType = 'application/json';
            extension = 'json';
            break;
        case 'txt':
        default:
            content = formatAsText(messages, title, includeTimestamps);
            mimeType = 'text/plain';
            extension = 'txt';
            break;
    }

    downloadFile(content, `${sanitizeFilename(title)}.${extension}`, mimeType);
}

function formatAsMarkdown(
    messages: ExportMessage[],
    title: string,
    includeTimestamps: boolean
): string {
    const lines: string[] = [];

    lines.push(`# ${title}`);
    lines.push(`\n_Exported on ${new Date().toLocaleString()}_\n`);
    lines.push('---\n');

    for (const msg of messages) {
        const role = msg.role === 'user' ? '👤 **You**' : '🤖 **AI**';
        const timestamp = includeTimestamps && msg.timestamp
            ? ` _(${msg.timestamp})_`
            : '';

        lines.push(`${role}${timestamp}\n`);
        lines.push(msg.content);
        lines.push('\n---\n');
    }

    return lines.join('\n');
}

function formatAsJson(messages: ExportMessage[], title: string): string {
    return JSON.stringify(
        {
            title,
            exportedAt: new Date().toISOString(),
            messageCount: messages.length,
            messages: messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp || null,
            })),
        },
        null,
        2
    );
}

function formatAsText(
    messages: ExportMessage[],
    title: string,
    includeTimestamps: boolean
): string {
    const lines: string[] = [];

    lines.push(`=== ${title} ===`);
    lines.push(`Exported: ${new Date().toLocaleString()}`);
    lines.push('');
    lines.push('-------------------------------------------');
    lines.push('');

    for (const msg of messages) {
        const role = msg.role === 'user' ? 'You' : 'AI';
        const timestamp = includeTimestamps && msg.timestamp
            ? ` [${msg.timestamp}]`
            : '';

        lines.push(`[${role}]${timestamp}`);
        lines.push(msg.content);
        lines.push('');
        lines.push('-------------------------------------------');
        lines.push('');
    }

    return lines.join('\n');
}

function sanitizeFilename(name: string): string {
    return name
        .replace(/[^a-z0-9\s-]/gi, '')
        .replace(/\s+/g, '_')
        .substring(0, 50);
}

function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

/**
 * Copy chat content to clipboard
 */
export async function copyToClipboard(
    messages: ExportMessage[],
    format: 'markdown' | 'text' = 'markdown'
): Promise<boolean> {
    try {
        const content = format === 'markdown'
            ? formatAsMarkdown(messages, 'Chat', false)
            : formatAsText(messages, 'Chat', false);

        await navigator.clipboard.writeText(content);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}
