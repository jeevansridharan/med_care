const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * Extract text from an image file using Tesseract OCR
 * @param {string} filePath - Path to the image file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromImage = async (filePath) => {
    try {
        const { data: { text } } = await Tesseract.recognize(filePath, 'eng+tam', {
            logger: (m) => {
                if (process.env.NODE_ENV === 'development') {
                    process.stdout.write(`\rOCR Progress: ${Math.round(m.progress * 100)}%`);
                }
            },
        });
        console.log('\nOCR extraction complete');
        return text;
    } catch (error) {
        throw new Error(`OCR extraction failed: ${error.message}`);
    }
};

/**
 * Extract text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        throw new Error(`PDF extraction failed: ${error.message}`);
    }
};

/**
 * Extract text from a plain text file
 * @param {string} filePath - Path to the text file
 * @returns {Promise<string>} - File content
 */
const extractTextFromTxt = async (filePath) => {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        throw new Error(`Text file reading failed: ${error.message}`);
    }
};

/**
 * Parse medicine names from raw extracted text
 * @param {string} text - Raw OCR/extracted text
 * @returns {string[]} - Array of medicine names
 */
const parseMedicineNames = (text) => {
    const lines = text
        .split(/[\n\r,;]+/)
        .map(line => line.trim())
        .filter(line => line.length > 2 && line.length < 80)
        .filter(line => /^[a-zA-Z\u0B80-\u0BFF\s\-\.]+$/.test(line))  // Allow Latin + Tamil chars
        .filter(line => !/^\d+$/.test(line))   // Exclude pure numbers
        .map(line => line.replace(/\b(mg|ml|mcg|tablet|tablets|capsule|capsules|once|twice|thrice|daily|morning|night|evening|dose)\b/gi, '').trim())
        .filter(line => line.length > 2);

    return [...new Set(lines)]; // Remove duplicates
};

module.exports = { extractTextFromImage, extractTextFromPDF, extractTextFromTxt, parseMedicineNames };
