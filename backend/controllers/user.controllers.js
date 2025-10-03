import User from '../models/user.model.js';
import uploadOnCloudinary from '../config/cloudinary.js';
import moment from 'moment/moment.js';
import geminiResponse from '../gemini.js';
export const getUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'getUser Error' });
    };
};

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        const updateData = { assistantName };

        if (req.file) {
            const assistantImage = await uploadOnCloudinary(req.file.path);
            if (!assistantImage) {
                return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
            }
            updateData.assistantImage = assistantImage;
        } else if (imageUrl) {
            updateData.assistantImage = imageUrl;
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found after update." });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error in updateAssistant:", error);
        res.status(500).json({ message: 'updateAssistant Error' });
    }
};

export const askToAssistant = async (req, res) => {
    try {
        console.log("askToAssistant: Received request");
        const {command} = req.body;
        console.log("askToAssistant: Command:", command);

        const user = await User.findById(req.userId);
        console.log("askToAssistant: User:", user);

        user.history.push(command);
        user.save();


        if (!user.assistantName) {
            console.log("askToAssistant: Assistant not configured");
            return res.status(400).json({ message: 'Assistant not configured. Please set an assistant name.' });
        }
        const userName = user.name;
        const assistantName = user.assistantName ;
        const commandWithoutAssistantName = command.toLowerCase().replace(assistantName.toLowerCase(), '').trim();
        console.log("askToAssistant: Cleaned command:", commandWithoutAssistantName);

        const result = await geminiResponse(commandWithoutAssistantName, assistantName, userName);
        console.log("askToAssistant: Gemini response:", result);

        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            console.log("askToAssistant: Invalid JSON format from Gemini");
            return res.status(500).json({ message: 'Invalid response format from Gemini API' });
        }
        const gemResult = JSON.parse(jsonMatch[0]);
        console.log("askToAssistant: Parsed Gemini result:", gemResult);

        const type = gemResult.type;

        switch (type) {
            case 'get-date':
                return res.json({
                    type,
                    userInput: gemResult.userInput, 
                    response: `current date is ${moment().format('MMMM Do YYYY')}`
                })
            case 'get-day':
                return res.json({
                    type,
                    userInput: gemResult.userInput, 
                    response: `today is ${moment().format('dddd')}`
                })
            case 'get-time':
                return res.json({
                    type,
                    userInput: gemResult.userInput, 
                    response: `current time is ${moment().format('h:mm:ss a')}`
                })
            case 'get-month':
                return res.json({
                    type,
                    userInput: gemResult.userInput, 
                    response: `current month is ${moment().format('MMMM')}`
                })
            case 'general':
            case 'google-search':
            case 'youtube-search':
            case 'youtube-play':
            case 'calculator-open':
            case 'instagram-open':
            case 'facebook-open':
            case 'weather-show':
                return res.json({
                    type,
                    userInput: gemResult.userInput, 
                    response: gemResult.response
                });
            default:
                console.log("askToAssistant: Unknown Gemini response type:", type);
                return res.status(500).json({ message: 'Unknown type from Gemini API' });
        }

    } catch (error) {
        console.error("Error in askToAssistant:", error);
        res.status(500).json({ message: 'askToAssistant Error' });
    }
};