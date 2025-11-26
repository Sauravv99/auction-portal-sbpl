// api/data.js
// Vercel serverless function (NOT Next.js)
// Supports:
// GET  /api/data  -> returns parsed players_list.json from the gist
// POST /api/data -> replaces the gist file with posted JSON

// export default async function handler(req, res) {
//   const GIST_ID = process.env.GIST_ID;
//   const TOKEN = process.env.GITHUB_TOKEN;
//   const FILE_NAME = "players_list.json";

//   if (!GIST_ID || !TOKEN) {
//     return res.status(500).json({ error: "Missing GIST_ID or GITHUB_TOKEN in environment." });
//   }

//   const GIST_API = `https://api.github.com/gists/${GIST_ID}`;
//   const headers = {
//     Authorization: `token ${TOKEN}`,
//     Accept: "application/vnd.github+json",
//     "User-Agent": "vercel-gist-handler"
//   };

//   try {
//     if (req.method === "GET") {
//       const r = await fetch(GIST_API, { headers });
//       const gist = await r.json();
//       const file = gist.files?.[FILE_NAME];
//       if (!file) return res.status(404).json({ error: "File not found in gist" });

//       return res.status(200).json(JSON.parse(file.content));
//     }

//     if (req.method === "POST") {
//       const newContent = JSON.stringify(req.body, null, 2);

//       const patchBody = {
//         files: {
//           [FILE_NAME]: {
//             content: newContent
//           }
//         }
//       };

//       const r = await fetch(GIST_API, {
//         method: "PATCH",
//         headers: { ...headers, "Content-Type": "application/json" },
//         body: JSON.stringify(patchBody)
//       });

//       const updated = await r.json();
//       return res.status(200).json({ ok: true, updated });
//     }

//     res.status(405).json({ error: "Method not allowed" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }
