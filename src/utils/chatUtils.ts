
/**
 * Formats a typing indicator string based on the number of users currently typing.
 * 
 * - If no users are typing, returns an empty string.
 * - If one user is typing, returns: "Alice is typing..."
 * - If two users are typing, returns: "Alice and Bob are typing..."
 * - If three users are typing, returns: "Alice, Bob and Carol are typing..."
 * - If more than three users are typing, returns: "Alice, Bob, Carol and N more are typing..."
 *   where N is the number of additional users.
 * 
 * @param typingUsers - Array of user names who are currently typing
 * @returns Formatted typing indicator string
 */
export function formatTypingText (typingUsers: string[]): string {
    const count = typingUsers.length;

    if (count === 0) return '';
    if (count === 1) return `${typingUsers[0]} is typing...`;
    if (count === 2) return `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
    if (count === 3) return `${typingUsers[0]}, ${typingUsers[1]} and ${typingUsers[2]} are typing...`;

    // For 4 or more users
    const remainingCount = count - 3;
    return `${typingUsers[0]}, ${typingUsers[1]}, ${typingUsers[2]} and ${remainingCount} more are typing...`;
};
