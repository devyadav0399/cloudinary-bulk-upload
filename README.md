# Cloudinary Bulk Image Uploader with EXIF Metadata

A Node.js script that bulk uploads images to Cloudinary while preserving EXIF metadata as Cloudinary context. This script automatically processes all images in a specified folder, extracts their EXIF data (including camera information, date, and GPS coordinates), and uploads them to your Cloudinary account with the metadata attached.

## Features

- Bulk upload images to Cloudinary
- Extract and preserve EXIF metadata
- Support for multiple image formats (JPG, JPEG, PNG, GIF)
- Automatic handling of special characters in metadata
- Custom folder organization in Cloudinary
- Detailed upload logging
- Error handling and reporting

## Prerequisites

Before you begin, ensure you have:

- Node.js (v12 or higher) installed
- A Cloudinary account
- Your Cloudinary API credentials

## Installation

1. Clone this repository or download the script:

```bash
git clone <repository-url>
```

2. Install the required dependencies:

```bash
npm install dotenv axios form-data exif-parser
```

or

```bash
npm install
```

3. Create a `.env` file in the project root with your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset_from_cloudinary
```

## Configuration

Update the following variables in the script according to your needs:

```javascript
const folderPath = "./images"; // Path to your images folder
```

Make sure to:

1. Create an upload preset in your Cloudinary settings and make sure it is set to "Unsigned"
2. Create the images folder if it doesn't exist
3. Adjust any specific upload parameters as needed

## Usage

1. Place your images in the specified images folder

2. Run the script:

```bash
node upload.js
```

The script will:

- Process all supported image files in the folder
- Extract EXIF metadata
- Upload each image to Cloudinary
- Log the upload results and any errors

## Metadata Handling

The script extracts and uploads the following EXIF metadata as Cloudinary context:

- Device information (Camera make and model)
- Original capture date and time
- GPS coordinates (if available)

Example context format:

```
device=Canon EOS R5|datetime_original=2024-01-01T12:00:00.000Z|location=40.7128,-74.0060
```

## Error Handling

The script includes comprehensive error handling for:

- File system operations
- EXIF data extraction
- Upload process
- API communication

All errors are logged to the console with relevant details.

## Known Limitations

- Processes images sequentially (not in parallel)
- Limited to specific image formats (JPG, JPEG, PNG, GIF)
- Maximum context limit of 1000 key-value pairs per asset
- Context values limited to 1024 characters

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## Support

For support:

1. Check the Cloudinary documentation: https://cloudinary.com/documentation

## Acknowledgments

- [Cloudinary](https://cloudinary.com) for their excellent service and API
- [exif-parser](https://github.com/bwindels/exif-parser) for EXIF extraction capabilities

## Security Note

- Never commit your `.env` file
- Always use environment variables for sensitive credentials

## Changelog

### 1.0.0

- Initial release
- Basic bulk upload functionality
- EXIF metadata extraction and context support
