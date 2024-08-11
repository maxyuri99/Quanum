#!/bin/bash
# Este script configura a versão correta do Node usando NVM e executa o comando passado como argumento.

# Carregar NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Carrega nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # Carrega nvm bash_completion

# Usar a versão específica do Node
nvm use 16

# Executar o comando passado para o script
"$@"
