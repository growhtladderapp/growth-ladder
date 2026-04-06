const fs = require('fs');
const files = [
    'components/AICoachChat.tsx',
    'components/Dashboard.tsx',
    'components/PrivacyPolicy.tsx',
    'components/SupportChat.tsx',
    'components/TermsAndConditions.tsx',
    'services/geminiService.ts',
    'public/manifest.json',
    'App.tsx',
    'package.json'
];

files.forEach(f => {
    try {
        let txt = fs.readFileSync(f, 'utf8');
        // If we detect the Mojibake for "ó" or "á", we apply the fix
        if (txt.includes('Ã')) {
            let fixed = Buffer.from(txt, 'binary').toString('utf8');
            fs.writeFileSync(f, fixed, 'utf8');
            console.log('Fixed', f);
        } else {
            console.log('Skipped', f, '- No Ã found');
        }
    } catch (e) {
        console.error('Error with', f, e.message);
    }
});
