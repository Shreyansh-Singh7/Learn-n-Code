const https = require('https');
const prompt = require('prompt-sync')();
 
// Function to fetch blog data from Tumblr API
function fetchTumblrData(blogName, start, end) {
const url = `https://good.tumblr.com/api/read/json?type=photo&num=50&start=0`;
 
    const req = https.get(url, (res) => {
        let data = '';
 
        // Collect data chunks
        res.on('data', (chunk) => {
            data += chunk;
        });
 
        // On end of response
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log(jsonData); // Log the entire response for debugging
 
                if (jsonData.response && jsonData.response.blog) {
                    displayBlogInfo(jsonData.response.blog);
                    displayPostImages(jsonData.response.posts);
                } else {
                    console.error('Blog information not found in the response:', jsonData.meta?.msg || 'Unknown error');
                }
            } catch (err) {
                console.error('Error parsing JSON response:', err.message);
            }
        });
    });
 
    // Add timeout to handle hanging requests
    req.setTimeout(5000, () => {
        console.error('Request timed out');
        req.destroy(); // Destroying the request to prevent memory leaks
    });
 
    req.on('error', (err) => {
        console.error('Error: ', err.message);
    });
}
 
// Function to display blog information
function displayBlogInfo(blog) {
    console.log('\nTitle:', blog.title);
console.log('Name:', blog.name);
    console.log('Description:', blog.description);
    console.log('No of posts:', blog.posts);
}
 
// Function to display image URLs for each post in the specified range
function displayPostImages(posts) {
    posts.forEach((post, index) => {
if (post.photos) {
            console.log(`${index + 1}.`);
post.photos.forEach((photo) => {
                // Displaying the highest quality image (1280 format)
                if (photo.original_size) {
                    console.log(photo.original_size.url);
                }
            });
        }
    });
}
 

function main() {
    // Input: Blog name
    const blogName = prompt('Enter the Tumblr blog name: ');

    // Input: Post range
    const range = prompt('Enter the range (e.g., 1-5): ');
    const [start, end] = range.split('-').map(Number);

    // Fetch Tumblr data
    fetchTumblrData(blogName, start - 1, end); // Adjusting start for zero-based index
}

main();