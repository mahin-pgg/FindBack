const createItemProvider = require('./providers/createItem.provider');
const getItemsProvider = require('./providers/getItems.provider');
const updateItemProvider = require('./providers/updateItem.provider');
const deleteItemProvider = require('./providers/deleteItem.provider');
const getAdminItemsProvider = require('./providers/getAdminItems.provider');
const getMyItemsProvider = require('./providers/getMyItems.provider');
const getItemByIdProvider = require('./providers/getItemById.provider');

async function handleCreateItem(req, res) {
    return await createItemProvider(req, res);
}

async function handleGetItems(req, res) {
    return await getItemsProvider(req, res);
}

async function handleUpdateItem(req, res) {
    return await updateItemProvider(req, res);
}

async function handleDeleteItem(req, res) {
    return await deleteItemProvider(req, res);
}

async function handleGetAdminItems(req, res) {
    return await getAdminItemsProvider(req, res);
}

async function handleGetMyItems(req, res) {
    return await getMyItemsProvider(req, res);
}

async function handleGetItemById(req, res) {
    return await getItemByIdProvider(req, res);
}

module.exports = {
    handleCreateItem,
    handleGetItems,
    handleUpdateItem,
    handleDeleteItem,
    handleGetAdminItems,
    handleGetMyItems,
    handleGetItemById,
};