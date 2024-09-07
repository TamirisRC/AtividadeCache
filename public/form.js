document.addEventListener('DOMContentLoaded', function () {
    const cepInput = document.getElementById('cep');
    
    if (cepInput) {
        cepInput.addEventListener('blur', async (event) => {
            const cep = event.target.value;

            if (/^[0-9]{5}-[0-9]{3}$|^[0-9]{8}$/.test(cep)) {
                let endereco = await buscarCep(cep);

                if (endereco) {
                    document.getElementById('logradouro').value = endereco.logradouro;
                    document.getElementById('bairro').value = endereco.bairro;
                    document.getElementById('cidade').value = endereco.localidade;
                    document.getElementById('estado').value = endereco.uf;
                } else {
                    console.error('Erro ao buscar o endereço.');
                }
            } else {
                console.error('CEP inválido.');
            }
        });
    }
});

async function buscarCep(cep) {
    let cache = localStorage.getItem(`cep_${cep}`);
    
    if (cache) {
        console.log("CACHE");
        return JSON.parse(cache);
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        if (!response.ok) {
            throw new Error('Erro ao buscar CEP');
        }

        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        localStorage.setItem(`cep_${cep}`, JSON.stringify(data));
        console.log("GET");
        return data;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        return null;
    }
}