import { app } from './app.js';
import './database/index.js';

const PORT = 3000;

app.listen(PORT, () => console.log(`🟢 Aplicação rodando na porta ${PORT} 🚀`));
