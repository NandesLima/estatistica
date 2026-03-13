document.addEventListener("DOMContentLoaded", function() {
    // Procura por todas as tabelas na página
    const tables = document.querySelectorAll('.md-typeset table');
    
    tables.forEach(table => {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            // Pega a primeira célula para criar um ID único baseado no nome da aula
            const firstCell = row.querySelector('td');
            if (!firstCell) return;
            
            const courseName = firstCell.textContent.trim();
            if (!courseName) return;

            // Cria um ID único juntando o caminho da URL e o nome da matéria
            const pagePath = window.location.pathname;
            const cleanStr = (pagePath + courseName).replace(/[^a-zA-Z0-9]/g, '');
            const uniqueId = 'completed-' + cleanStr;

            // Encontra a última célula (Coluna Status ou equivalente)
            const cells = row.querySelectorAll('td');
            const lastCell = cells[cells.length - 1];
            
            // Cria o botão
            const btn = document.createElement('button');
            btn.className = 'progress-btn';
            
            // Verifica se o aluno já concluiu (no Local Storage do navegador dele)
            const isCompleted = localStorage.getItem(uniqueId) === 'true';
            
            // Função para atualizar o visual
            const updateUI = (completed) => {
                if (completed) {
                    btn.innerHTML = '✅ Concluído';
                    btn.classList.add('completed');
                    row.classList.add('row-completed');
                } else {
                    btn.innerHTML = '⭕ Marcar';
                    btn.classList.remove('completed');
                    row.classList.remove('row-completed');
                }
            };
            
            // Aplica estado inicial
            updateUI(isCompleted);
            
            // O que acontece ao clicar no botão
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                // Lê o estado atual
                const currentState = localStorage.getItem(uniqueId) === 'true';
                const newState = !currentState;
                
                // Salva no navegador
                localStorage.setItem(uniqueId, newState);
                
                // Atualiza visual
                updateUI(newState);
            });
            
            // Substitui o conteúdo da última coluna pelo botão
            lastCell.innerHTML = '';
            lastCell.appendChild(btn);
        });
    });
});
