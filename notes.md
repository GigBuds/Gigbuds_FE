IndexedDb/ExpoSqlite: 
    - conversations
        id: number;
        name: string;
        avatar: string;
        lastMessage: string;
        timestamp: number;
        isOnline: boolean;
        isTyping: boolean;

	- drafts
        - convo id
        - content
    - chat history (last 50 messages for each convo, not read included, used for every page refresh)
        - convoId
        - messageId
        - senderId
        - readByIds[]
        - sentDate (timestamp)
        - deliveryStatus
        - content
    - chat history (cache)
        - convoId
        - messageId
        - senderId
        - readByIds[]
        - sentDate (timestamp)
        - deliveryStatus
        - content

the cache is for storing the messages the user request when scrolling up.
whereas the non-cache is for storing the latest 50 messages for each conversation

write case:
    (chat history)
    - everytime when user reload page 

    
    (chat history cache)
    - when user scrolls up to see older messages -> request from server, add them to this collection
    - when user logs out/close tab or when tab is unloaded -> empty collection

data flow: every page refresh -> sync with server -> write to the chat history with the new data