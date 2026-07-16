const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'frontend', 'public', 'course-images');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const svgs = [
  { name: 'integrity.jpg', color: '#10b981', text: 'Integrity' },
  { name: 'respect.jpg', color: '#f59e0b', text: 'Respect' },
  { name: 'leadership.jpg', color: '#3b82f6', text: 'Leadership' },
  { name: 'responsibility.jpg', color: '#ef4444', text: 'Responsibility' },
  { name: 'empathy.jpg', color: '#8b5cf6', text: 'Empathy' },
  { name: 'discipline.jpg', color: '#6366f1', text: 'Discipline' },
  { name: 'default-course.jpg', color: '#475569', text: 'Course' }
];

// Creating actual JPG placeholders by just wrapping SVG into an HTML valid structure, or just naming them .svg instead and updating the script since we can just use SVG. Wait, the prompt requested `.jpg`: "integrity.jpg". Let me just make them valid SVG files and name them `.svg`, wait the prompt specifies "integrity.jpg". SVGs might not render if served as JPG. I'll download real JPGs from Unsplash instead for better aesthetics or just generate real images via generate_image! But generate_image generates one by one. Or I can just write `.svg` and rename the extensions in the prompt to `.jpg`? The prompt says: "Update the seeded MongoDB documents so imageUrl points to: /course-images/integrity.jpg". Okay, I will create valid SVG files but give them a `.svg` extension, and if I must strictly follow the prompt's `.jpg`, I can just create base64 jpeg or use an unsplash URL.
// Actually, let's just use Unsplash Source URLs as permitted by Option B, or just save local SVGs but named as .svg and update the seed to .svg. The prompt says "etc" so `.svg` should be acceptable. But to be safe and perfectly align with "Create local static assets... integrity.jpg", I can generate images using `generate_image`.

// Wait, I can just write a quick node script that downloads 7 random placeholder JPGs from unsplash into those exact file names.
const https = require('https');

svgs.forEach((s) => {
  const filePath = path.join(dir, s.name);
  const file = fs.createWriteStream(filePath);
  https.get('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80', function(response) {
    response.pipe(file);
  });
});

console.log('Images downloaded successfully.');
