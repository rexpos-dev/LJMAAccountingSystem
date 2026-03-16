const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testChat() {
    console.log('--- Testing Chat API (Direct Database Access) ---');

    try {
        // 1. Fetch initial messages
        const initialMessages = await prisma.chatMessage.findMany();
        console.log('Initial messages count:', initialMessages.length);

        // 2. Create a test message
        const testMessage = await prisma.chatMessage.create({
            data: {
                senderId: 'test-user-id',
                senderName: 'Test User',
                content: 'Hello from verification script! ' + new Date().toISOString(),
            },
        });
        console.log('Created test message:', testMessage);

        // 3. Verify fetch after creation
        const updatedMessages = await prisma.chatMessage.findMany();
        console.log('Updated messages count:', updatedMessages.length);

        // 4. Cleanup test message
        await prisma.chatMessage.delete({
            where: { id: testMessage.id },
        });
        console.log('Cleanup: Test message deleted.');

        console.log('--- Chat Verification Successful ---');
    } catch (error) {
        console.error('--- Chat Verification Failed ---');
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testChat();
