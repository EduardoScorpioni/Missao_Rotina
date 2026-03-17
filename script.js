let sequenciaJogador = [];

let sequenciaCorreta = [
"levantar",
"cama",
"roupa",
"escovar",
"mochila",
"escola"
];

function selecionar(acao){

sequenciaJogador.push(acao);

console.log(sequenciaJogador);

}

function verificar(){

let resultado = document.getElementById("resultado");

if(JSON.stringify(sequenciaJogador) === JSON.stringify(sequenciaCorreta)){
resultado.innerHTML = "Parabéns! Sequência correta!";
resultado.style.color = "green";
}
else{
resultado.innerHTML = "Sequência incorreta! Tente novamente.";
resultado.style.color = "red";
}

sequenciaJogador = [];

}