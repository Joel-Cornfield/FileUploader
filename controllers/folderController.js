const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createFolder = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;

    try {
        const folder = await prisma.folder.create({
            data: { name, userId },
        });
        res.json(folder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create folder' });
    }
};

exports.getAllFolders = async (req, res) => {
    const userId = req.user.id;
    try {
        const folders = await prisma.folder.findMany({
            where: { userId },
        });
        res.json(folders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get all folders' });
    }
};