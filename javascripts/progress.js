document.addEventListener("DOMContentLoaded", function() {
    // Procura por todas as tabelas na página
    const tables = document.querySelectorAll('.md-typeset table');
    
    tables.forEach(table => {
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
        if (!tbody || !thead) return;
        
        const headerRow = thead.querySelector('tr');
        if (!headerRow) return;

        // Verifica se já existe uma coluna "Status"
        const headers = Array.from(headerRow.querySelectorAll('th'));
        let statusColIndex = headers.findIndex(th => th.textContent.trim().toLowerCase() === 'status');
        let isNewColumn = false;

        if (statusColIndex === -1) {
            // Se não existir, cria uma nova coluna "Status" no cabeçalho
            const statusTh = document.createElement('th');
            statusTh.textContent = 'Status';
            headerRow.appendChild(statusTh);
            statusColIndex = headers.length; // Novo índice será o último
            isNewColumn = true;
        }

        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const firstCell = row.querySelector('td');
            if (!firstCell) return;
            
            const courseName = firstCell.textContent.trim();
            if (!courseName) return;

            // Cria um ID único juntando o caminho da URL e o nome da matéria
            const pagePath = window.location.pathname;
            const cleanStr = (pagePath + courseName).replace(/[^a-zA-Z0-9]/g, '');
            const uniqueId = 'completed-' + cleanStr;

            // Encontra a célula correta ou cria uma nova se adicionamos a coluna
            let targetCell;
            if (isNewColumn) {
                targetCell = document.createElement('td');
                row.appendChild(targetCell);
            } else {
                const cells = row.querySelectorAll('td');
                targetCell = cells[statusColIndex];
                // Caso a linha tenha menos colunas que o cabeçalho (markdown mal formatado)
                if (!targetCell) {
                    targetCell = document.createElement('td');
                    row.appendChild(targetCell);
                }
            }
            
            // Cria o botão
            const btn = document.createElement('button');
            btn.className = 'progress-btn';
            
            // Verifica se o aluno já concluiu (no Local Storage)
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
            
            // Evento de clique
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const currentState = localStorage.getItem(uniqueId) === 'true';
                const newState = !currentState;
                
                localStorage.setItem(uniqueId, newState);
                updateUI(newState);
            });
            
            // Adiciona o botão na célula correta (limpando o conteúdo anterior se houver)
            targetCell.innerHTML = '';
            targetCell.appendChild(btn);
        });
    });
});
