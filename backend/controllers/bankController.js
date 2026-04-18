const Bank = require("../models/Bank");

// @desc    Get all banks
// @route   GET /api/banks
// @access  Public
const getBanks = async (req, res) => {
    try {
        const banks = await Bank.find();
        res.status(200).json(banks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new bank
// @route   POST /api/banks
// @access  Private/Admin
const createBank = async (req, res) => {
    try {
        const bank = await Bank.create(req.body);
        res.status(201).json(bank);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a bank
// @route   PUT /api/banks/:id
// @access  Private/Admin
const updateBank = async (req, res) => {
    try {
        const bank = await Bank.findById(req.params.id);

        if (!bank) {
            res.status(404);
            throw new Error("Bank not found");
        }

        const updatedBank = await Bank.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedBank);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a bank
// @route   DELETE /api/banks/:id
// @access  Private/Admin
const deleteBank = async (req, res) => {
    try {
        const bank = await Bank.findById(req.params.id);

        if (!bank) {
            res.status(404);
            throw new Error("Bank not found");
        }

        await bank.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getBanks,
    createBank,
    updateBank,
    deleteBank,
};
