document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');

    if (cepInput) {
        cepInput.addEventListener('input', function() {
            const cep = this.value.replace(/\D/g, '');

            if (cep.length === 8) {
                fetch(`/getCEP/${cep}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            const { logradouro, bairro, localidade, uf } = data.data;
                            document.getElementById('logradouro').value = logradouro || '';
                            document.getElementById('bairro').value = bairro || '';
                            document.getElementById('cidade').value = localidade || '';
                            document.getElementById('estado').value = uf || '';
                        } else {
                            console.error('Erro:', data.data);
                        }
                    })
                    .catch(error => console.error('Erro:', error));
            }
        });
    }
});