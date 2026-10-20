import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================
// DATOS: Verbos irregulares [base, past, participle, es, def]
// ============================================================
const IRREGULAR = [
  ["arise", "arose", "arisen", "Surgir", "Aparecer o producirse una situación, problema u oportunidad."],
  ["awake", "awoke", "awoken", "Despertar", "Dejar de dormir o hacer que alguien deje de dormir."],
  ["be", "was/were", "been", "Ser / Estar", "Expresar identidad, estado o existencia."],
  ["bear", "bore", "born", "Soportar / Dar a luz", "Aguantar algo difícil o tener un hijo."],
  ["beat", "beat", "beaten", "Golpear / Vencer", "Golpear repetidamente o ganar a alguien en una competencia."],
  ["become", "became", "become", "Convertirse / Llegar a ser", "Pasar a tener una nueva condición o estado."],
  ["begin", "began", "begun", "Empezar / Comenzar", "Dar inicio a una acción, proceso, evento o actividad."],
  ["bend", "bent", "bent", "Doblar / Curvar", "Hacer que algo recto tome una forma curva."],
  ["bet", "bet", "bet", "Apostar", "Arriesgar dinero u otra cosa sobre el resultado de algo incierto."],
  ["bind", "bound", "bound", "Atar / Vincular", "Unir o sujetar firmemente algo con una cuerda o vínculo."],
  ["bite", "bit", "bitten", "Morder", "Usar los dientes para cortar o sujetar algo."],
  ["bleed", "bled", "bled", "Sangrar", "Perder sangre a causa de una herida."],
  ["blow", "blew", "blown", "Soplar", "Mover aire con la boca o producir una corriente de aire."],
  ["break", "broke", "broken", "Romper", "Hacer que algo se separe en piezas o deje de funcionar."],
  ["breed", "bred", "bred", "Criar / Reproducirse", "Producir crías o criar animales."],
  ["bring", "brought", "brought", "Traer", "Llevar algo o a alguien hacia el lugar donde se habla."],
  ["broadcast", "broadcast", "broadcast", "Transmitir", "Emitir un programa de radio o televisión."],
  ["build", "built", "built", "Construir", "Levantar una estructura o crear algo a partir de partes."],
  ["burn", "burnt", "burnt", "Quemar", "Destruir o dañar algo con fuego o calor intenso."],
  ["burst", "burst", "burst", "Reventar / Estallar", "Romperse repentinamente por presión interna."],
  ["bust", "bust", "bust", "Romper / Arrestar", "Dañar algo o atrapar a alguien cometiendo un delito."],
  ["buy", "bought", "bought", "Comprar", "Obtener algo a cambio de dinero."],
  ["cast", "cast", "cast", "Lanzar / Repartir papeles", "Arrojar algo o asignar un papel en una obra."],
  ["catch", "caught", "caught", "Atrapar / Coger", "Agarrar algo que se mueve o alcanzar a alguien."],
  ["choose", "chose", "chosen", "Elegir", "Seleccionar una opción entre varias posibles."],
  ["cling", "clung", "clung", "Aferrarse", "Sujetarse con fuerza a algo o a alguien."],
  ["come", "came", "come", "Venir", "Moverse hacia el lugar donde está quien habla."],
  ["cost", "cost", "cost", "Costar", "Tener un precio determinado."],
  ["creep", "crept", "crept", "Arrastrarse", "Moverse lenta y silenciosamente."],
  ["cut", "cut", "cut", "Cortar", "Dividir algo usando un objeto afilado."],
  ["deal", "dealt", "dealt", "Tratar / Repartir", "Encargarse de un asunto o repartir algo, como cartas."],
  ["dig", "dug", "dug", "Cavar", "Hacer un agujero en la tierra."],
  ["do", "did", "done", "Hacer / Realizar", "Ejecutar una acción o actividad."],
  ["draw", "drew", "drawn", "Dibujar / Atraer", "Crear una imagen con líneas o atraer la atención de algo."],
  ["dream", "dreamt", "dreamt", "Soñar", "Tener imágenes mientras se duerme, o desear algo."],
  ["drink", "drank", "drunk", "Beber", "Ingerir un líquido."],
  ["drive", "drove", "driven", "Conducir / Manejar", "Controlar un vehículo para moverlo."],
  ["dwell", "dwelt", "dwelt", "Habitar / Morar", "Vivir en un lugar determinado."],
  ["eat", "ate", "eaten", "Comer", "Ingerir alimentos."],
  ["fall", "fell", "fallen", "Caer", "Bajar por efecto de la gravedad de forma repentina."],
  ["feed", "fed", "fed", "Alimentar", "Dar comida a una persona o animal."],
  ["feel", "felt", "felt", "Sentir", "Experimentar una sensación física o emocional."],
  ["fight", "fought", "fought", "Pelear / Luchar", "Usar la fuerza o argumentos contra alguien o algo."],
  ["find", "found", "found", "Encontrar", "Descubrir algo que se buscaba o no se esperaba."],
  ["fit", "fit", "fit", "Encajar / Quedar bien", "Tener el tamaño o la forma adecuada."],
  ["flee", "fled", "fled", "Huir", "Escapar rápidamente de un peligro."],
  ["fling", "flung", "flung", "Arrojar", "Lanzar algo con fuerza y sin cuidado."],
  ["fly", "flew", "flown", "Volar", "Moverse por el aire."],
  ["forbid", "forbade", "forbidden", "Prohibir", "No permitir que algo se haga."],
  ["forecast", "forecast", "forecast", "Pronosticar", "Predecir cómo será algo en el futuro, como el clima."],
  ["forget", "forgot", "forgotten", "Olvidar", "Dejar de recordar algo."],
  ["forgive", "forgave", "forgiven", "Perdonar", "Dejar de sentir rencor hacia alguien por una falta."],
  ["freeze", "froze", "frozen", "Congelar", "Convertir un líquido en sólido por el frío, o quedarse inmóvil."],
  ["get", "got", "gotten", "Obtener / Conseguir / Llegar", "Adquirir, recibir o llegar a un lugar o estado."],
  ["give", "gave", "given", "Dar", "Entregar algo a alguien."],
  ["go", "went", "gone", "Ir / Dirigirse", "Moverse de un lugar a otro, alejándose de donde se habla."],
  ["grind", "ground", "ground", "Moler", "Reducir algo a partículas pequeñas por fricción."],
  ["grow", "grew", "grown", "Crecer", "Aumentar de tamaño o desarrollarse con el tiempo."],
  ["hang", "hung", "hung", "Colgar", "Sujetar algo desde arriba sin que toque el suelo."],
  ["have", "had", "had", "Tener / Haber", "Poseer algo o usarse como auxiliar de los tiempos perfectos."],
  ["hear", "heard", "heard", "Oír / Escuchar", "Percibir sonidos con el oído."],
  ["hide", "hid", "hidden", "Esconder", "Poner algo o a alguien donde no se pueda ver."],
  ["hit", "hit", "hit", "Golpear", "Dar un golpe a algo o alguien."],
  ["hold", "held", "held", "Sostener / Sujetar", "Mantener algo agarrado con las manos."],
  ["hurt", "hurt", "hurt", "Herir / Doler", "Causar daño físico o emocional."],
  ["input", "input", "input", "Introducir datos", "Ingresar información en un sistema o dispositivo."],
  ["keep", "kept", "kept", "Mantener / Guardar", "Conservar algo en determinado estado o lugar."],
  ["kneel", "knelt", "knelt", "Arrodillarse", "Doblar las rodillas hasta tocar el suelo."],
  ["knit", "knit", "knit", "Tejer (a mano)", "Hacer una prenda entrelazando hilo con agujas."],
  ["know", "knew", "known", "Saber / Conocer", "Tener información o estar familiarizado con algo."],
  ["lay", "laid", "laid", "Colocar / Poner", "Poner algo con cuidado en una superficie."],
  ["lead", "led", "led", "Liderar / Guiar", "Dirigir a un grupo de personas o mostrar el camino."],
  ["lean", "leant", "leant", "Inclinar / Apoyarse", "Poner el cuerpo o algo en una posición inclinada."],
  ["leap", "leapt", "leapt", "Saltar", "Impulsarse en el aire con fuerza."],
  ["learn", "learnt", "learnt", "Aprender", "Adquirir conocimiento o una habilidad."],
  ["leave", "left", "left", "Dejar / Salir", "Irse de un lugar o abandonar algo."],
  ["lend", "lent", "lent", "Prestar", "Dar algo a alguien temporalmente."],
  ["let", "let", "let", "Dejar / Permitir", "Autorizar que algo suceda."],
  ["lie", "lay", "lain", "Acostarse / Yacer", "Ponerse en posición horizontal."],
  ["light", "lit", "lit", "Encender / Iluminar", "Hacer que algo produzca luz o fuego."],
  ["lose", "lost", "lost", "Perder", "Dejar de tener algo o no ganar una competencia."],
  ["make", "made", "made", "Hacer / Fabricar / Crear", "Producir o fabricar algo nuevo."],
  ["mean", "meant", "meant", "Significar", "Tener un significado o intención determinada."],
  ["meet", "met", "met", "Conocer / Encontrarse", "Ver a alguien por primera vez o reunirse con alguien."],
  ["misunderstand", "misunderstood", "misunderstood", "Malentender", "Entender algo de forma incorrecta."],
  ["mistake", "mistook", "mistaken", "Confundir", "Entender o identificar algo de forma incorrecta."],
  ["mow", "mowed", "mown", "Cortar (césped)", "Cortar hierba con una máquina."],
  ["outgrow", "outgrew", "outgrown", "Superar en crecimiento", "Crecer más que algo, o dejar atrás un hábito."],
  ["overcome", "overcame", "overcome", "Superar", "Vencer una dificultad o problema."],
  ["overdo", "overdid", "overdone", "Exagerar", "Hacer algo en exceso."],
  ["overhear", "overheard", "overheard", "Escuchar por casualidad", "Oír algo sin querer, sin que lo sepan los que hablan."],
  ["oversee", "oversaw", "overseen", "Supervisar", "Controlar que un trabajo se haga correctamente."],
  ["overthrow", "overthrew", "overthrown", "Derrocar", "Quitar del poder a un gobierno por la fuerza."],
  ["partake", "partook", "partaken", "Participar", "Tomar parte en una actividad."],
  ["pay", "paid", "paid", "Pagar", "Entregar dinero a cambio de algo."],
  ["prove", "proved", "proven", "Demostrar / Probar", "Mostrar con evidencia que algo es verdadero."],
  ["put", "put", "put", "Poner / Colocar", "Situar algo en un lugar determinado."],
  ["quit", "quit", "quit", "Dejar / Renunciar", "Abandonar una actividad, trabajo o hábito."],
  ["read", "read", "read", "Leer", "Interpretar un texto escrito."],
  ["rebuild", "rebuilt", "rebuilt", "Reconstruir", "Construir de nuevo algo que se dañó."],
  ["redo", "redid", "redone", "Rehacer", "Volver a hacer algo."],
  ["repay", "repaid", "repaid", "Devolver (dinero)", "Pagar de vuelta una deuda o favor."],
  ["rewrite", "rewrote", "rewritten", "Reescribir", "Volver a escribir algo para mejorarlo."],
  ["ride", "rode", "ridden", "Montar / Cabalgar", "Viajar sobre un vehículo o animal."],
  ["ring", "rang", "rung", "Sonar / Llamar", "Producir un sonido como el de una campana o teléfono."],
  ["rise", "rose", "risen", "Subir / Elevarse", "Moverse hacia arriba o aumentar de nivel."],
  ["run", "ran", "run", "Correr", "Moverse rápidamente usando las piernas."],
  ["say", "said", "said", "Decir", "Expresar algo con palabras."],
  ["see", "saw", "seen", "Ver", "Percibir algo con los ojos."],
  ["seek", "sought", "sought", "Buscar", "Intentar encontrar algo."],
  ["sell", "sold", "sold", "Vender", "Entregar algo a cambio de dinero."],
  ["send", "sent", "sent", "Enviar", "Hacer que algo llegue a otro lugar o persona."],
  ["set", "set", "set", "Fijar / Establecer", "Colocar algo en una posición o determinar algo."],
  ["sew", "sewed", "sewn", "Coser", "Unir telas con hilo y aguja."],
  ["shake", "shook", "shaken", "Agitar / Sacudir", "Mover algo rápidamente de un lado a otro."],
  ["shed", "shed", "shed", "Desprenderse de", "Deshacerse de algo, como piel, hojas o lágrimas."],
  ["shine", "shone", "shone", "Brillar", "Emitir o reflejar luz."],
  ["shoot", "shot", "shot", "Disparar", "Lanzar un proyectil con un arma."],
  ["show", "showed", "shown", "Mostrar", "Dejar ver algo a alguien."],
  ["shrink", "shrank", "shrunk", "Encoger", "Reducirse de tamaño."],
  ["shut", "shut", "shut", "Cerrar", "Hacer que algo deje de estar abierto."],
  ["sing", "sang", "sung", "Cantar", "Producir música con la voz."],
  ["sink", "sank", "sunk", "Hundir", "Irse hacia el fondo del agua."],
  ["sit", "sat", "sat", "Sentarse", "Ponerse en posición de descanso apoyando el cuerpo."],
  ["sleep", "slept", "slept", "Dormir", "Descansar con los ojos cerrados en estado de reposo."],
  ["slide", "slid", "slid", "Deslizar", "Moverse suavemente sobre una superficie."],
  ["sling", "slung", "slung", "Lanzar / Colgar", "Arrojar algo con un movimiento amplio."],
  ["slit", "slit", "slit", "Cortar (una raja)", "Hacer un corte largo y estrecho."],
  ["smell", "smelt", "smelt", "Oler", "Percibir un olor con la nariz."],
  ["sneak", "snuck", "snuck", "Escabullirse", "Moverse de forma sigilosa para no ser visto."],
  ["sow", "sowed", "sown", "Sembrar", "Plantar semillas en la tierra."],
  ["speak", "spoke", "spoken", "Hablar", "Comunicarse usando palabras habladas."],
  ["speed", "sped", "sped", "Acelerar", "Moverse o ir más rápido de lo normal."],
  ["spell", "spelt", "spelt", "Deletrear", "Decir o escribir las letras de una palabra en orden."],
  ["spend", "spent", "spent", "Gastar", "Usar dinero o tiempo en algo."],
  ["spill", "spilt", "spilt", "Derramar", "Hacer que un líquido se salga de su recipiente."],
  ["spin", "spun", "spun", "Girar", "Dar vueltas rápidamente sobre un eje."],
  ["spit", "spat", "spat", "Escupir", "Expulsar saliva con fuerza por la boca."],
  ["split", "split", "split", "Dividir / Partir", "Separar algo en dos o más partes."],
  ["spoil", "spoilt", "spoilt", "Estropear / Malcriar", "Dañar algo o consentir demasiado a alguien."],
  ["spread", "spread", "spread", "Extender / Propagar", "Hacer que algo cubra un área mayor."],
  ["spring", "sprang", "sprung", "Saltar / Surgir", "Moverse de repente hacia arriba o hacia adelante."],
  ["stand", "stood", "stood", "Estar de pie / Pararse", "Mantenerse erguido sobre los pies."],
  ["steal", "stole", "stolen", "Robar", "Tomar algo que pertenece a otra persona sin permiso."],
  ["stick", "stuck", "stuck", "Pegar / Quedarse atascado", "Adherir algo o no poder moverse."],
  ["sting", "stung", "stung", "Picar", "Causar un dolor punzante, como un insecto."],
  ["stink", "stank", "stunk", "Apestar", "Oler muy mal."],
  ["strike", "struck", "struck", "Golpear / Hacer huelga", "Dar un golpe fuerte o dejar de trabajar en protesta."],
  ["strive", "strove", "striven", "Esforzarse", "Trabajar duro para conseguir algo."],
  ["swear", "swore", "sworn", "Jurar / Maldecir", "Prometer solemnemente o decir palabras ofensivas."],
  ["sweep", "swept", "swept", "Barrer", "Limpiar el suelo con una escoba."],
  ["swell", "swelled", "swollen", "Hincharse", "Aumentar de tamaño por líquido o aire acumulado."],
  ["swim", "swam", "swum", "Nadar", "Moverse en el agua usando el cuerpo."],
  ["swing", "swung", "swung", "Columpiar / Balancear", "Moverse de un lado a otro colgado de un punto."],
  ["take", "took", "taken", "Tomar / Llevar / Coger", "Agarrar algo o transportarlo de un lugar a otro."],
  ["teach", "taught", "taught", "Enseñar", "Transmitir conocimientos a alguien."],
  ["tear", "tore", "torn", "Rasgar / Romper", "Separar algo, como papel o tela, tirando de ello."],
  ["tell", "told", "told", "Contar / Decir", "Comunicar información a alguien."],
  ["think", "thought", "thought", "Pensar / Creer", "Usar la mente para razonar o formar una opinión."],
  ["throw", "threw", "thrown", "Lanzar", "Impulsar algo con la mano por el aire."],
  ["understand", "understood", "understood", "Entender / Comprender", "Captar el significado de algo."],
  ["undo", "undid", "undone", "Deshacer", "Revertir una acción o abrir algo que estaba cerrado."],
  ["upset", "upset", "upset", "Disgustar / Alterar", "Causar tristeza, enojo o preocupación a alguien."],
  ["wake", "woke", "woken", "Despertar", "Dejar de dormir."],
  ["wear", "wore", "worn", "Llevar puesto", "Tener puesta una prenda de vestir."],
  ["weave", "wove", "woven", "Tejer", "Entrelazar hilos para formar una tela."],
  ["weep", "wept", "wept", "Llorar", "Derramar lágrimas por tristeza u otra emoción fuerte."],
  ["win", "won", "won", "Ganar", "Obtener la victoria en una competencia."],
  ["wind", "wound", "wound", "Enrollar / Dar cuerda", "Girar algo repetidamente sobre sí mismo."],
  ["withdraw", "withdrew", "withdrawn", "Retirar", "Sacar algo, como dinero, o apartarse de una situación."],
  ["withhold", "withheld", "withheld", "Retener", "No dar algo que se espera o se debe."],
  ["write", "wrote", "written", "Escribir", "Representar palabras o ideas por medio de letras."],
];

// ============================================================
// DATOS: Verbos regulares [base, es, def]
// ============================================================
const REGULAR = [
  ["accept", "Aceptar", "Recibir de forma voluntaria algo que se ofrece, o estar de acuerdo con una idea."],
  ["achieve", "Lograr / Alcanzar", "Conseguir algo después de esfuerzo o trabajo."],
  ["act", "Actuar", "Hacer algo o comportarse de cierta manera."],
  ["add", "Añadir / Sumar", "Incorporar algo más a lo que ya existe."],
  ["admire", "Admirar", "Sentir respeto o aprecio por alguien o algo."],
  ["admit", "Admitir", "Reconocer que algo es cierto, o permitir la entrada."],
  ["advise", "Aconsejar", "Dar una recomendación a alguien."],
  ["afford", "Permitirse (pagar)", "Tener suficiente dinero o tiempo para algo."],
  ["agree", "Estar de acuerdo", "Tener la misma opinión que otra persona."],
  ["allow", "Permitir", "Dar permiso para que algo suceda."],
  ["announce", "Anunciar", "Comunicar algo de forma pública."],
  ["answer", "Responder", "Dar una respuesta a una pregunta."],
  ["appear", "Aparecer", "Volverse visible o parecer de cierta manera."],
  ["apply", "Aplicar / Solicitar", "Usar algo con un propósito o presentar una solicitud."],
  ["approve", "Aprobar", "Aceptar algo como correcto o válido."],
  ["argue", "Discutir", "Hablar con alguien defendiendo opiniones opuestas."],
  ["arrange", "Organizar", "Poner las cosas en orden o planear un evento."],
  ["arrive", "Llegar", "Alcanzar el lugar de destino."],
  ["ask", "Preguntar / Pedir", "Hacer una pregunta o solicitar algo."],
  ["attach", "Adjuntar", "Unir una cosa a otra."],
  ["attack", "Atacar", "Usar la fuerza contra alguien o algo."],
  ["attempt", "Intentar", "Tratar de hacer algo."],
  ["attend", "Asistir", "Estar presente en un evento o lugar."],
  ["avoid", "Evitar", "Alejarse de algo o impedir que ocurra."],
  ["bake", "Hornear", "Cocinar alimentos en un horno."],
  ["behave", "Comportarse", "Actuar de una manera determinada."],
  ["belong", "Pertenecer", "Formar parte de algo o ser propiedad de alguien."],
  ["believe", "Creer", "Considerar que algo es verdad o confiar en alguien."],
  ["blame", "Culpar", "Responsabilizar a alguien de algo malo."],
  ["bless", "Bendecir", "Pedir protección divina para alguien o algo."],
  ["boil", "Hervir", "Calentar un líquido hasta que burbujee."],
  ["borrow", "Pedir prestado", "Tomar algo de alguien con la intención de devolverlo."],
  ["bother", "Molestar", "Causar incomodidad a alguien."],
  ["brush", "Cepillar", "Limpiar o arreglar algo con un cepillo."],
  ["bury", "Enterrar", "Cubrir algo con tierra."],
  ["calculate", "Calcular", "Hacer una operación matemática o estimar algo."],
  ["call", "Llamar", "Comunicarse por teléfono o decir el nombre de alguien."],
  ["care", "Cuidar / Importar", "Preocuparse por alguien o algo."],
  ["carry", "Cargar / Llevar", "Transportar algo de un lugar a otro."],
  ["cause", "Causar", "Ser el motivo de que algo suceda."],
  ["celebrate", "Celebrar", "Conmemorar un evento especial con alegría."],
  ["change", "Cambiar", "Hacer que algo sea diferente."],
  ["chat", "Charlar", "Conversar de manera informal."],
  ["check", "Revisar / Comprobar", "Examinar algo para verificar que esté correcto."],
  ["cheer", "Animar / Vitorear", "Dar ánimo o gritar de alegría."],
  ["chew", "Masticar", "Triturar comida con los dientes."],
  ["claim", "Reclamar / Afirmar", "Decir que algo es cierto o exigir un derecho."],
  ["clap", "Aplaudir", "Golpear las palmas de las manos en señal de aprobación."],
  ["clean", "Limpiar", "Quitar la suciedad de algo."],
  ["climb", "Escalar / Subir", "Moverse hacia arriba usando manos y pies."],
  ["close", "Cerrar", "Hacer que algo deje de estar abierto."],
  ["collect", "Coleccionar / Recoger", "Reunir varias cosas del mismo tipo."],
  ["comb", "Peinar", "Arreglar el cabello con un peine."],
  ["compare", "Comparar", "Examinar las semejanzas y diferencias entre cosas."],
  ["compete", "Competir", "Participar en una contienda para ganar."],
  ["complain", "Quejarse", "Expresar disgusto o insatisfacción."],
  ["complete", "Completar", "Terminar algo por completo."],
  ["confirm", "Confirmar", "Asegurar que algo es cierto o definitivo."],
  ["connect", "Conectar", "Unir dos o más cosas entre sí."],
  ["consider", "Considerar", "Pensar cuidadosamente sobre algo."],
  ["contain", "Contener", "Tener algo dentro."],
  ["continue", "Continuar", "Seguir haciendo algo sin detenerse."],
  ["control", "Controlar", "Tener el poder de dirigir algo."],
  ["cook", "Cocinar", "Preparar alimentos aplicando calor."],
  ["copy", "Copiar", "Reproducir algo de forma idéntica."],
  ["correct", "Corregir", "Arreglar un error."],
  ["cough", "Toser", "Expulsar aire de los pulmones de forma brusca."],
  ["count", "Contar", "Decir números en orden o calcular una cantidad."],
  ["cover", "Cubrir", "Poner algo encima de otra cosa para protegerla u ocultarla."],
  ["crash", "Chocar / Estrellarse", "Golpear con fuerza contra algo."],
  ["create", "Crear", "Hacer que algo exista por primera vez."],
  ["cross", "Cruzar", "Pasar de un lado a otro de algo."],
  ["cry", "Llorar", "Derramar lágrimas, generalmente por tristeza."],
  ["cycle", "Andar en bicicleta", "Montar en bicicleta."],
  ["damage", "Dañar", "Causar un perjuicio o deterioro a algo."],
  ["dance", "Bailar", "Moverse siguiendo el ritmo de la música."],
  ["decide", "Decidir", "Tomar una decisión después de pensarlo."],
  ["declare", "Declarar", "Afirmar algo de manera oficial o pública."],
  ["decorate", "Decorar", "Hacer que un lugar se vea más bonito."],
  ["delay", "Retrasar", "Hacer que algo ocurra más tarde de lo previsto."],
  ["deliver", "Entregar", "Llevar algo hasta su destino final."],
  ["demand", "Exigir", "Pedir algo de forma firme."],
  ["deny", "Negar", "Decir que algo no es verdad."],
  ["depend", "Depender", "Necesitar de algo o alguien para funcionar."],
  ["describe", "Describir", "Explicar cómo es algo o alguien con palabras."],
  ["design", "Diseñar", "Crear el plan o la forma de algo."],
  ["destroy", "Destruir", "Causar que algo deje de existir."],
  ["develop", "Desarrollar", "Hacer crecer o evolucionar algo."],
  ["die", "Morir", "Dejar de vivir."],
  ["disagree", "Estar en desacuerdo", "Tener una opinión diferente a la de otra persona."],
  ["discover", "Descubrir", "Encontrar algo que no se conocía antes."],
  ["discuss", "Discutir / Debatir", "Hablar sobre un tema para intercambiar opiniones."],
  ["dislike", "No gustar / Desagradar", "Sentir rechazo hacia algo o alguien."],
  ["divide", "Dividir", "Separar algo en partes."],
  ["download", "Descargar", "Transferir datos de internet a un dispositivo."],
  ["dress", "Vestir(se)", "Ponerse ropa."],
  ["drop", "Dejar caer / Soltar", "Hacer que algo caiga al suelo."],
  ["dry", "Secar", "Quitar la humedad de algo."],
  ["dust", "Quitar el polvo", "Limpiar el polvo de una superficie."],
  ["earn", "Ganar (dinero)", "Recibir dinero a cambio de trabajo."],
  ["educate", "Educar", "Enseñar conocimientos o valores a alguien."],
  ["employ", "Emplear", "Dar trabajo a alguien, o usar algo."],
  ["encourage", "Animar / Alentar", "Dar confianza o ánimo a alguien."],
  ["enjoy", "Disfrutar", "Sentir placer al hacer algo."],
  ["enter", "Entrar", "Pasar al interior de un lugar."],
  ["escape", "Escapar", "Librarse de un lugar o peligro."],
  ["examine", "Examinar", "Observar algo con atención y detalle."],
  ["exercise", "Ejercitar(se)", "Realizar actividad física."],
  ["exist", "Existir", "Tener presencia real."],
  ["expand", "Expandir", "Hacer que algo sea más grande."],
  ["expect", "Esperar (anticipar)", "Creer que algo va a suceder."],
  ["explain", "Explicar", "Hacer que algo se entienda con claridad."],
  ["explore", "Explorar", "Recorrer un lugar para descubrirlo."],
  ["express", "Expresar", "Comunicar una idea o sentimiento."],
  ["face", "Enfrentar", "Hacer frente a una situación difícil."],
  ["fail", "Fallar / Fracasar", "No tener éxito en algo."],
  ["fasten", "Abrochar / Asegurar", "Sujetar algo firmemente, como un cinturón."],
  ["fill", "Llenar", "Ocupar un espacio vacío por completo."],
  ["finish", "Terminar", "Llegar al final de una actividad."],
  ["fix", "Arreglar / Reparar", "Hacer que algo roto vuelva a funcionar."],
  ["fold", "Doblar", "Plegar algo sobre sí mismo."],
  ["follow", "Seguir", "Ir detrás de alguien o actuar según una indicación."],
  ["force", "Forzar / Obligar", "Hacer que alguien haga algo en contra de su voluntad."],
  ["form", "Formar", "Crear o dar forma a algo."],
  ["gather", "Reunir(se)", "Juntar personas o cosas en un mismo lugar."],
  ["greet", "Saludar", "Dar la bienvenida a alguien con palabras o gestos."],
  ["guess", "Adivinar", "Dar una respuesta sin estar seguro."],
  ["guide", "Guiar", "Mostrar el camino o dirigir a alguien."],
  ["handle", "Manejar", "Ocuparse de una situación o usar algo con las manos."],
  ["happen", "Suceder / Pasar", "Producirse un evento o acontecimiento."],
  ["hate", "Odiar", "Sentir una fuerte aversión hacia algo o alguien."],
  ["heal", "Sanar", "Recuperarse de una herida o enfermedad."],
  ["help", "Ayudar", "Colaborar con alguien para que logre algo."],
  ["hope", "Esperar (desear)", "Desear que algo bueno suceda."],
  ["hug", "Abrazar", "Rodear con los brazos a alguien con cariño."],
  ["hunt", "Cazar", "Perseguir animales para capturarlos."],
  ["hurry", "Apresurarse", "Hacer algo más rápido de lo normal."],
  ["identify", "Identificar", "Reconocer quién o qué es algo."],
  ["ignore", "Ignorar", "No prestar atención a algo o alguien a propósito."],
  ["imagine", "Imaginar", "Crear una idea o imagen en la mente."],
  ["impress", "Impresionar", "Causar una fuerte admiración en alguien."],
  ["improve", "Mejorar", "Hacer que algo sea mejor."],
  ["include", "Incluir", "Hacer que algo forme parte de un conjunto."],
  ["increase", "Aumentar", "Hacer que algo sea más grande en cantidad."],
  ["influence", "Influir", "Tener un efecto sobre las decisiones o acciones de alguien."],
  ["inform", "Informar", "Dar información a alguien sobre algo."],
  ["insist", "Insistir", "Repetir una petición o idea con firmeza."],
  ["install", "Instalar", "Poner algo en su lugar para que funcione."],
  ["intend", "Tener la intención de", "Planear hacer algo."],
  ["interview", "Entrevistar", "Hacer preguntas a alguien para conocer su opinión."],
  ["introduce", "Presentar", "Dar a conocer a una persona o un tema por primera vez."],
  ["invent", "Inventar", "Crear algo que no existía antes."],
  ["invite", "Invitar", "Pedir a alguien que participe en algo."],
  ["join", "Unirse", "Pasar a formar parte de un grupo."],
  ["joke", "Bromear", "Decir algo gracioso sin intención seria."],
  ["jump", "Saltar", "Impulsarse hacia arriba con las piernas."],
  ["justify", "Justificar", "Dar razones que expliquen una acción."],
  ["kick", "Patear", "Golpear algo con el pie."],
  ["kill", "Matar", "Causar la muerte de alguien o algo."],
  ["kiss", "Besar", "Tocar con los labios como muestra de cariño."],
  ["knock", "Tocar / Golpear (puerta)", "Dar golpes suaves, normalmente en una puerta."],
  ["land", "Aterrizar", "Llegar al suelo después de volar."],
  ["laugh", "Reír", "Expresar alegría o diversión con la voz."],
  ["launch", "Lanzar (un producto)", "Presentar algo nuevo al público."],
  ["like", "Gustar", "Sentir agrado por algo o alguien."],
  ["limit", "Limitar", "Poner un límite a algo."],
  ["listen", "Escuchar", "Prestar atención a un sonido o a lo que dice alguien."],
  ["live", "Vivir", "Estar vivo o residir en un lugar."],
  ["load", "Cargar", "Poner contenido dentro de algo, como un vehículo o programa."],
  ["lock", "Cerrar con llave", "Asegurar algo con una cerradura."],
  ["look", "Mirar", "Dirigir la vista hacia algo."],
  ["love", "Amar", "Sentir un cariño muy profundo por alguien o algo."],
  ["manage", "Gestionar / Administrar", "Dirigir o controlar una actividad o negocio."],
  ["march", "Marchar", "Caminar con pasos firmes y ritmo constante."],
  ["mark", "Marcar", "Poner una señal sobre algo."],
  ["marry", "Casarse", "Unirse legalmente en matrimonio."],
  ["match", "Combinar / Coincidir", "Ser igual o adecuado a otra cosa."],
  ["measure", "Medir", "Determinar el tamaño, peso o cantidad de algo."],
  ["melt", "Derretir", "Convertir un sólido en líquido por calor."],
  ["mention", "Mencionar", "Hablar de algo brevemente."],
  ["mix", "Mezclar", "Combinar varias cosas en una sola."],
  ["move", "Mover(se)", "Cambiar de posición o de lugar."],
  ["name", "Nombrar", "Dar un nombre a algo o alguien."],
  ["need", "Necesitar", "Requerir algo indispensable."],
  ["notice", "Notar / Darse cuenta", "Percibir algo que antes no se había visto."],
  ["obey", "Obedecer", "Seguir una orden o regla."],
  ["observe", "Observar", "Mirar algo con atención durante un tiempo."],
  ["obtain", "Obtener", "Conseguir algo que se buscaba."],
  ["occur", "Ocurrir", "Suceder un evento."],
  ["offer", "Ofrecer", "Presentar algo para que alguien lo tome o acepte."],
  ["open", "Abrir", "Hacer que algo deje de estar cerrado."],
  ["order", "Ordenar / Pedir", "Dar una instrucción o solicitar algo, como comida."],
  ["organize", "Organizar", "Poner las cosas en un orden adecuado."],
  ["owe", "Deber (dinero)", "Tener una deuda con alguien."],
  ["own", "Poseer", "Ser dueño de algo."],
  ["pack", "Empacar", "Meter cosas en una maleta o caja."],
  ["paint", "Pintar", "Aplicar color sobre una superficie."],
  ["park", "Estacionar", "Dejar un vehículo detenido en un lugar."],
  ["pass", "Pasar / Aprobar", "Moverse a través de algo o aprobar un examen."],
  ["permit", "Permitir", "Dar autorización para algo."],
  ["phone", "Llamar por teléfono", "Comunicarse con alguien usando el teléfono."],
  ["pick", "Elegir / Recoger", "Seleccionar algo o levantarlo del suelo."],
  ["plan", "Planear", "Preparar con anticipación cómo hacer algo."],
  ["plant", "Plantar", "Poner una semilla o planta en la tierra."],
  ["play", "Jugar / Tocar (música)", "Realizar una actividad por diversión o interpretar música."],
  ["please", "Complacer", "Hacer feliz o satisfacer a alguien."],
  ["point", "Señalar", "Indicar algo con el dedo."],
  ["polish", "Pulir", "Hacer que una superficie brille mediante fricción."],
  ["pour", "Verter", "Hacer que un líquido salga de un recipiente."],
  ["practice", "Practicar", "Repetir una actividad para mejorar en ella."],
  ["praise", "Elogiar", "Expresar admiración por algo o alguien."],
  ["prefer", "Preferir", "Gustar más una cosa que otra."],
  ["prepare", "Preparar", "Dejar algo listo con anticipación."],
  ["present", "Presentar", "Mostrar algo formalmente a otras personas."],
  ["press", "Presionar", "Aplicar fuerza sobre algo."],
  ["pretend", "Fingir", "Aparentar algo que no es cierto."],
  ["prevent", "Prevenir / Evitar", "Hacer que algo malo no suceda."],
  ["print", "Imprimir", "Reproducir texto o imágenes en papel."],
  ["produce", "Producir", "Fabricar o generar algo."],
  ["promise", "Prometer", "Comprometerse a hacer algo."],
  ["protect", "Proteger", "Cuidar a alguien o algo de un peligro."],
  ["protest", "Protestar", "Expresar desacuerdo de forma pública."],
  ["provide", "Proporcionar", "Dar algo que alguien necesita."],
  ["pull", "Tirar / Jalar", "Mover algo hacia uno mismo con fuerza."],
  ["punish", "Castigar", "Imponer una sanción por una falta."],
  ["push", "Empujar", "Aplicar fuerza para mover algo hacia adelante."],
  ["question", "Cuestionar / Preguntar", "Poner algo en duda o hacer preguntas."],
  ["queue", "Hacer fila", "Esperar en línea por turno."],
  ["race", "Competir (carrera)", "Participar en una carrera de velocidad."],
  ["rain", "Llover", "Caer agua del cielo."],
  ["raise", "Levantar / Criar", "Mover algo hacia arriba o educar a un hijo."],
  ["reach", "Alcanzar / Llegar a", "Llegar a un lugar o conseguir un objetivo."],
  ["realize", "Darse cuenta", "Comprender algo de repente."],
  ["receive", "Recibir", "Obtener algo que se envía o entrega."],
  ["recognize", "Reconocer", "Identificar algo que ya se conocía."],
  ["recommend", "Recomendar", "Sugerir algo por sus buenas cualidades."],
  ["record", "Grabar / Registrar", "Guardar sonido, video o datos para uso posterior."],
  ["reduce", "Reducir", "Hacer que algo sea menor en cantidad."],
  ["refer", "Referirse", "Aludir a algo o remitir a alguien a otra fuente."],
  ["reflect", "Reflejar", "Devolver una imagen, luz, o pensar profundamente."],
  ["refuse", "Rechazar", "No aceptar algo que se ofrece o pide."],
  ["regret", "Arrepentirse", "Sentir pesar por algo que se hizo o no se hizo."],
  ["reject", "Rechazar", "No aceptar una propuesta, idea o persona."],
  ["relax", "Relajarse", "Descansar y liberar tensión."],
  ["release", "Liberar / Lanzar", "Dejar libre algo o publicar un producto."],
  ["rely", "Confiar / Depender", "Contar con algo o alguien con confianza."],
  ["remain", "Permanecer", "Quedarse en un mismo estado o lugar."],
  ["remember", "Recordar", "Tener presente algo en la memoria."],
  ["remind", "Recordar (a alguien)", "Hacer que alguien se acuerde de algo."],
  ["remove", "Eliminar / Quitar", "Hacer que algo deje de estar en un lugar."],
  ["rent", "Alquilar", "Pagar por el uso temporal de algo."],
  ["repair", "Reparar", "Arreglar algo que está dañado."],
  ["repeat", "Repetir", "Volver a decir o hacer algo."],
  ["replace", "Reemplazar", "Poner algo nuevo en lugar de otra cosa."],
  ["reply", "Responder", "Contestar a una pregunta o mensaje."],
  ["report", "Informar / Reportar", "Dar a conocer información sobre un hecho."],
  ["request", "Solicitar", "Pedir algo de manera formal."],
  ["require", "Requerir", "Necesitar algo de forma indispensable."],
  ["rescue", "Rescatar", "Salvar a alguien de un peligro."],
  ["resist", "Resistir", "Oponerse a algo o aguantar una fuerza."],
  ["respect", "Respetar", "Tratar a alguien con consideración."],
  ["respond", "Responder", "Reaccionar o contestar a algo."],
  ["rest", "Descansar", "Dejar de hacer esfuerzo para recuperar energía."],
  ["retire", "Jubilarse", "Dejar de trabajar después de muchos años."],
  ["return", "Regresar / Devolver", "Volver a un lugar o entregar algo de vuelta."],
  ["reveal", "Revelar", "Dar a conocer algo que era secreto."],
  ["review", "Revisar / Reseñar", "Examinar algo de nuevo o dar una opinión sobre ello."],
  ["reward", "Recompensar", "Dar algo bueno a alguien por su esfuerzo."],
  ["rinse", "Enjuagar", "Limpiar algo con agua para quitar restos de jabón."],
  ["rob", "Robar", "Quitarle algo a alguien por la fuerza o engaño."],
  ["roll", "Rodar / Enrollar", "Moverse girando sobre sí mismo."],
  ["rub", "Frotar", "Pasar algo repetidamente sobre una superficie."],
  ["rush", "Apresurarse", "Moverse con mucha prisa."],
  ["satisfy", "Satisfacer", "Cumplir las expectativas o necesidades de alguien."],
  ["save", "Ahorrar / Salvar", "Guardar dinero o rescatar a alguien de un peligro."],
  ["scare", "Asustar", "Causar miedo a alguien."],
  ["scratch", "Rascar", "Frotar la piel con las uñas."],
  ["scream", "Gritar", "Emitir un sonido fuerte con la voz por miedo o dolor."],
  ["search", "Buscar", "Tratar de encontrar algo."],
  ["seem", "Parecer", "Dar la impresión de tener cierta cualidad o estado."],
  ["select", "Seleccionar", "Elegir algo entre varias opciones."],
  ["sell_x", "SKIP", "SKIP"],
  ["separate", "Separar", "Dividir algo que estaba junto."],
  ["serve", "Servir", "Atender a alguien o poner comida en la mesa."],
  ["settle", "Resolver / Establecerse", "Llegar a un acuerdo o instalarse en un lugar."],
  ["share", "Compartir", "Dar parte de algo a otra persona."],
  ["shock", "Sorprender / Impactar", "Causar una fuerte impresión."],
  ["shop", "Comprar (ir de compras)", "Ir a tiendas a comprar cosas."],
  ["shout", "Gritar", "Hablar muy alto, normalmente con enojo o para llamar la atención."],
  ["sign", "Firmar", "Escribir el nombre propio en un documento."],
  ["skip", "Saltar(se) / Omitir", "No hacer algo que normalmente se hace, o brincar."],
  ["slip", "Resbalar", "Perder el equilibrio sobre una superficie."],
  ["smile", "Sonreír", "Mostrar alegría con una expresión en la boca."],
  ["smoke", "Fumar", "Inhalar el humo de un cigarrillo."],
  ["snap", "Chasquear / Romperse", "Partirse de repente con un sonido seco."],
  ["sneeze", "Estornudar", "Expulsar aire de la nariz de forma repentina e involuntaria."],
  ["solve", "Resolver", "Encontrar la solución a un problema."],
  ["sound", "Sonar", "Producir un sonido, o parecer cierto."],
  ["spare", "Prescindir de", "Dar algo que no se necesita en ese momento."],
  ["spray", "Rociar", "Esparcir un líquido en gotas pequeñas."],
  ["stamp", "Sellar / Pisotear", "Poner un sello o golpear el suelo con el pie."],
  ["stare", "Mirar fijamente", "Observar algo sin apartar la vista."],
  ["start", "Empezar", "Dar comienzo a algo."],
  ["stay", "Quedarse", "Permanecer en un lugar."],
  ["step", "Dar un paso", "Mover el pie para caminar."],
  ["stir", "Remover (cocina)", "Mezclar un líquido o alimento con un movimiento circular."],
  ["stop", "Detener(se)", "Dejar de moverse o de hacer algo."],
  ["store", "Almacenar", "Guardar algo para usarlo más tarde."],
  ["study", "Estudiar", "Dedicar tiempo a aprender sobre un tema."],
  ["submit", "Enviar / Someter", "Entregar algo para su revisión o aceptar una autoridad."],
  ["succeed", "Tener éxito", "Lograr lo que se proponía."],
  ["suffer", "Sufrir", "Sentir dolor físico o emocional."],
  ["suggest", "Sugerir", "Proponer una idea."],
  ["support", "Apoyar", "Ayudar a alguien o sostener algo."],
  ["suppose", "Suponer", "Creer que algo es probable sin estar seguro."],
  ["surprise", "Sorprender", "Causar asombro a alguien."],
  ["surround", "Rodear", "Estar alrededor de algo."],
  ["survive", "Sobrevivir", "Seguir con vida después de un peligro."],
  ["suspect", "Sospechar", "Creer que algo malo puede ser cierto."],
  ["switch", "Cambiar (de opción)", "Pasar de una cosa a otra."],
  ["talk", "Hablar", "Comunicarse verbalmente con alguien."],
  ["taste", "Probar (sabor)", "Percibir el sabor de algo con la boca."],
  ["thank", "Agradecer", "Expresar gratitud."],
  ["touch", "Tocar", "Poner la mano u otra parte del cuerpo sobre algo."],
  ["trade", "Comerciar / Intercambiar", "Intercambiar bienes o servicios."],
  ["train", "Entrenar", "Prepararse físicamente o enseñar una habilidad."],
  ["translate", "Traducir", "Pasar un texto de un idioma a otro."],
  ["travel", "Viajar", "Desplazarse a otros lugares."],
  ["treat", "Tratar", "Comportarse de cierta manera con alguien, o curar una enfermedad."],
  ["trust", "Confiar", "Creer en la honestidad de alguien."],
  ["try", "Intentar", "Hacer un esfuerzo por lograr algo."],
  ["turn", "Girar / Convertirse", "Cambiar de dirección o de estado."],
  ["type", "Escribir a máquina", "Escribir usando un teclado."],
  ["unite", "Unir", "Juntar varias partes en un todo."],
  ["unlock", "Abrir (con llave)", "Quitar el seguro de algo cerrado."],
  ["update", "Actualizar", "Poner algo al día."],
  ["use", "Usar", "Emplear algo con un fin determinado."],
  ["visit", "Visitar", "Ir a ver a alguien o un lugar."],
  ["vote", "Votar", "Elegir una opción en una elección."],
  ["wait", "Esperar", "Permanecer en un lugar hasta que algo ocurra."],
  ["walk", "Caminar", "Moverse a pie."],
  ["want", "Querer", "Desear tener o hacer algo."],
  ["warn", "Advertir", "Avisar a alguien de un peligro."],
  ["wash", "Lavar", "Limpiar algo con agua."],
  ["watch", "Mirar / Ver", "Observar algo con atención, como la televisión."],
  ["water", "Regar", "Echar agua a las plantas."],
  ["wave", "Saludar con la mano", "Mover la mano de un lado a otro como saludo."],
  ["weigh", "Pesar", "Medir el peso de algo."],
  ["welcome", "Dar la bienvenida", "Recibir con agrado a alguien."],
  ["whisper", "Susurrar", "Hablar muy bajo."],
  ["whistle", "Silbar", "Producir un sonido agudo con la boca."],
  ["wish", "Desear", "Querer que algo suceda."],
  ["wonder", "Preguntarse", "Tener curiosidad por saber algo."],
  ["work", "Trabajar", "Realizar una actividad laboral."],
  ["worry", "Preocuparse", "Sentir inquietud por algo."],
  ["wrap", "Envolver", "Cubrir algo con papel u otro material."],
  ["yell", "Gritar", "Hablar con voz muy alta, normalmente por enojo o emoción."],
  ["yawn", "Bostezar", "Abrir mucho la boca al sentir sueño o cansancio."],
  ["zip", "Cerrar con cremallera", "Cerrar algo usando una cremallera."],
].filter((v) => v[1] !== "SKIP");

// ============================================================
// Conjugación en inglés
// ============================================================
const DOUBLING = new Set([
  "begin", "bet", "bid", "cut", "dig", "fit", "forbid", "forget", "get", "hit", "input",
  "knit", "let", "put", "quit", "run", "set", "shut", "sit", "slit", "spin", "spit", "split",
  "swim", "upset", "win", "wed", "rid", "admit", "chat", "clap", "control", "drop", "grab",
  "hug", "occur", "permit", "plan", "prefer", "refer", "regret", "rob", "shop", "skip", "slip",
  "snap", "step", "stir", "stop", "submit", "transfer", "wrap", "scan", "jog",
]);

const Y_CHANGE = new Set([
  "apply", "carry", "copy", "cry", "deny", "dry", "hurry", "identify", "justify", "marry",
  "satisfy", "study", "try", "worry", "bury", "reply",
]);

const VOWELS = "aeiou";

function lastConsonant(base) {
  return base[base.length - 1];
}

function thirdPerson(base) {
  if (base === "be") return "is";
  if (base === "have") return "has";
  if (/(s|x|z|ch|sh)$/.test(base)) return base + "es";
  if (/[^aeiou]o$/.test(base)) return base + "es";
  if (Y_CHANGE.has(base)) return base.slice(0, -1) + "ies";
  return base + "s";
}

function gerund(base) {
  if (base === "be") return "being";
  if (/ie$/.test(base)) return base.slice(0, -2) + "ying";
  if (/e$/.test(base) && !/(ee|oe|ye)$/.test(base)) return base.slice(0, -1) + "ing";
  if (DOUBLING.has(base)) return base + lastConsonant(base) + "ing";
  return base + "ing";
}

function regularPast(base) {
  if (Y_CHANGE.has(base)) return base.slice(0, -1) + "ied";
  if (/e$/.test(base)) return base + "d";
  if (DOUBLING.has(base)) return base + lastConsonant(base) + "ed";
  return base + "ed";
}

// ============================================================
// Verbos populares (sección destacada) y verbos "detallados"
// (reciben ejemplo para cada una de las 5 formas)
// ============================================================
const POPULAR = ["be", "come", "do", "get", "go", "have", "know", "make", "say", "see", "take", "think"];

const DETAILED_EXTRA = [
  "want", "look", "use", "find", "give", "tell", "work", "call", "try", "ask",
  "need", "feel", "become", "leave", "put", "mean", "keep", "begin", "help", "talk",
  "turn", "start", "show", "hear", "play", "run", "move", "like", "live", "believe",
  "bring", "happen", "write", "provide", "sit", "stand", "lose", "pay", "meet", "include",
  "continue", "set", "learn", "change", "lead", "understand", "watch", "follow", "stop", "create",
  "speak", "read", "allow", "add", "spend", "grow", "open", "walk", "win", "offer",
  "remember", "love", "consider", "appear", "buy", "wait", "serve", "die", "send", "expect",
  "build", "stay", "fall", "cut", "reach", "kill", "remain", "suggest", "raise", "pass",
  "sell", "require", "report", "decide", "pull", "accept", "agree", "break", "explain", "hold",
  "seem",
];

const DETAILED = new Set([...POPULAR, ...DETAILED_EXTRA]);

// ============================================================
// Generador de frases de ejemplo (plantillas sin necesidad de
// conjugar el español de forma compleja)
// ============================================================
const OBJECTS = [
  { en: "this", en2: "it", en3: "the offer", en4: "the task", en5: "it", es: "esto", es2: "eso", es3: "la oferta", es4: "la tarea", es5: "esto" },
  { en: "that", en2: "the plan", en3: "the project", en4: "the report", en5: "problems", es: "eso", es2: "el plan", es3: "el proyecto", es4: "el informe", es5: "los problemas" },
  { en: "the challenge", en2: "the rules", en3: "the job offer", en4: "the terms", en5: "criticism", es: "el reto", es2: "las reglas", es3: "la oferta de trabajo", es4: "los términos", es5: "las críticas" },
  { en: "the idea", en2: "the message", en3: "the news", en4: "the document", en5: "feedback", es: "la idea", es2: "el mensaje", es3: "la noticia", es4: "el documento", es5: "los comentarios" },
  { en: "the house", en2: "the car", en3: "the money", en4: "the gift", en5: "mistakes", es: "la casa", es2: "el coche", es3: "el dinero", es4: "el regalo", es5: "los errores" },
  { en: "a new plan", en2: "the schedule", en3: "the test", en4: "the bridge", en5: "new skills", es: "un nuevo plan", es2: "el horario", es3: "la prueba", es4: "el puente", es5: "nuevas habilidades" },
];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function infinitiveOf(es) {
  const first = es.split("/")[0].trim();
  return first.toLowerCase();
}

const SUBJECTS_THIRD = ["She", "He", "The teacher", "My sister", "The manager"];
const SUBJECTS_PAST = ["They", "She", "We", "He", "The team"];
const SUBJECTS_PAST_ES = ["Ellos", "Ella", "Nosotros", "Él", "El equipo"];

function buildExamples(base, forms, es) {
  const inf = infinitiveOf(es);
  const infCap = cap(inf);
  const o = OBJECTS[hashStr(base) % OBJECTS.length];
  const subjIdx = hashStr(base + "s") % SUBJECTS_THIRD.length;
  const subjThird = SUBJECTS_THIRD[subjIdx];
  const subjPastIdx = hashStr(base + "p") % SUBJECTS_PAST.length;
  const subjPast = SUBJECTS_PAST[subjPastIdx];
  const subjPastEs = SUBJECTS_PAST_ES[subjPastIdx];

  return {
    base: {
      en: `I need to ${forms.base} ${o.en} today.`,
      es: `Necesito ${inf} ${o.es} hoy.`,
    },
    third: {
      en: `${subjThird} usually ${forms.third} ${o.en2} at work.`,
      es: `${subjThird === "She" || subjThird === "My sister" ? "Ella" : subjThird === "He" ? "Él" : "Esa persona"} suele ${inf} ${o.es2} en el trabajo.`,
    },
    past: {
      en: `${subjPast} ${forms.past} ${o.en3} yesterday.`,
      es: `${subjPastEs} decidieron ${inf} ${o.es3} ayer.`,
    },
    participle: {
      en: `${cap(o.en4)} has already been ${forms.participle}.`,
      es: `Ya es posible ${inf} ${o.es4}.`,
    },
    gerund: {
      en: `${cap(forms.gerund)} ${o.en5} helps a lot.`,
      es: `${infCap} ${o.es5} ayuda mucho.`,
    },
  };
}

// Overrides manuales de alta calidad para los verbos más visibles
const OVERRIDES = {
  accept: {
    usage: "Se usa al recibir invitaciones, propuestas, regalos o asumir realidades.",
    examples: {
      base: { en: "I am ready to accept the challenge.", es: "Estoy listo para aceptar el reto." },
      third: { en: "He accepts credit cards.", es: "Él acepta tarjetas de crédito." },
      past: { en: "She accepted the job offer.", es: "Ella aceptó la oferta de trabajo." },
      participle: { en: "The terms have been accepted.", es: "Los términos han sido aceptados." },
      gerund: { en: "Accepting criticism helps growth.", es: "Aceptar las críticas ayuda a crecer." },
    },
  },
  yell: {
    usage: "Se usa con yell at (alguien); es más fuerte que shout.",
    examples: {
      base: { en: "He yelled across the street.", es: "Él gritó al otro lado de la calle." },
    },
  },
  be: {
    usage: "Es el verbo más fundamental del inglés: identidad, descripción, estado y existencia.",
    examples: {
      base: { en: "I want to be a good friend.", es: "Quiero ser un buen amigo." },
      third: { en: "She is very talented.", es: "Ella es muy talentosa." },
      past: { en: "They were at the party last night.", es: "Ellos estuvieron en la fiesta anoche." },
      participle: { en: "It has always been this way.", es: "Siempre ha sido así." },
      gerund: { en: "Being honest is important.", es: "Ser honesto es importante." },
    },
  },
  come: {
    usage: "Se usa para movimiento hacia el hablante o hacia el lugar del que se habla.",
    examples: {
      base: { en: "Please come to my house tonight.", es: "Por favor, ven a mi casa esta noche." },
      third: { en: "Winter comes after autumn.", es: "El invierno viene después del otoño." },
      past: { en: "They came to the meeting late.", es: "Ellos vinieron tarde a la reunión." },
      participle: { en: "Spring has finally come.", es: "La primavera finalmente ha llegado." },
      gerund: { en: "Coming here was a great idea.", es: "Venir aquí fue una gran idea." },
    },
  },
  do: {
    usage: "Se usa como verbo principal y como auxiliar en preguntas y negaciones.",
    examples: {
      base: { en: "I always do my homework.", es: "Yo siempre hago mi tarea." },
      third: { en: "She does her best every day.", es: "Ella hace su mejor esfuerzo cada día." },
      past: { en: "We did a great job yesterday.", es: "Hicimos un gran trabajo ayer." },
      participle: { en: "The task has been done.", es: "La tarea ha sido hecha." },
      gerund: { en: "Doing exercise keeps you healthy.", es: "Hacer ejercicio te mantiene saludable." },
    },
  },
  get: {
    usage: "Muy versátil: obtener, recibir, llegar o convertirse en algo.",
    examples: {
      base: { en: "I need to get some rest.", es: "Necesito conseguir algo de descanso." },
      third: { en: "He gets good grades.", es: "Él obtiene buenas calificaciones." },
      past: { en: "They got home late.", es: "Ellos llegaron tarde a casa." },
      participle: { en: "The package has been gotten already.", es: "El paquete ya ha sido conseguido." },
      gerund: { en: "Getting better takes practice.", es: "Mejorar lleva práctica." },
    },
  },
  go: {
    usage: "Se usa para movimiento alejándose del lugar donde se habla.",
    examples: {
      base: { en: "I want to go home now.", es: "Quiero irme a casa ahora." },
      third: { en: "She goes to school by bus.", es: "Ella va a la escuela en autobús." },
      past: { en: "We went to the beach last summer.", es: "Fuimos a la playa el verano pasado." },
      participle: { en: "He has already gone to work.", es: "Él ya se ha ido al trabajo." },
      gerund: { en: "Going there alone is risky.", es: "Ir allí solo es arriesgado." },
    },
  },
  have: {
    usage: "Se usa para posesión y como auxiliar de los tiempos perfectos.",
    examples: {
      base: { en: "I have two brothers.", es: "Tengo dos hermanos." },
      third: { en: "She has a new car.", es: "Ella tiene un auto nuevo." },
      past: { en: "We had a great time.", es: "Lo pasamos muy bien." },
      participle: { en: "They have had this problem before.", es: "Ellos han tenido este problema antes." },
      gerund: { en: "Having a plan is essential.", es: "Tener un plan es esencial." },
    },
  },
  know: {
    usage: "Se usa para conocimiento de hechos o para estar familiarizado con alguien.",
    examples: {
      base: { en: "I know the answer.", es: "Yo sé la respuesta." },
      third: { en: "He knows this city very well.", es: "Él conoce muy bien esta ciudad." },
      past: { en: "She knew the truth all along.", es: "Ella sabía la verdad desde el principio." },
      participle: { en: "It has been known for years.", es: "Se ha sabido durante años." },
      gerund: { en: "Knowing the risks helps you decide.", es: "Conocer los riesgos te ayuda a decidir." },
    },
  },
  make: {
    usage: "Se usa para crear, fabricar o producir algo.",
    examples: {
      base: { en: "I will make dinner tonight.", es: "Haré la cena esta noche." },
      third: { en: "She makes beautiful jewelry.", es: "Ella hace joyas hermosas." },
      past: { en: "They made a huge mistake.", es: "Ellos cometieron un gran error." },
      participle: { en: "This bread has been made by hand.", es: "Este pan ha sido hecho a mano." },
      gerund: { en: "Making decisions quickly is a skill.", es: "Tomar decisiones rápido es una habilidad." },
    },
  },
  say: {
    usage: "Se usa para citar palabras exactas o reportar lo que alguien dice.",
    examples: {
      base: { en: "I want to say thank you.", es: "Quiero decir gracias." },
      third: { en: "He always says the right thing.", es: "Él siempre dice lo correcto." },
      past: { en: "She said she was happy.", es: "Ella dijo que estaba feliz." },
      participle: { en: "It has been said many times.", es: "Se ha dicho muchas veces." },
      gerund: { en: "Saying sorry takes courage.", es: "Decir perdón requiere valentía." },
    },
  },
  see: {
    usage: "Se usa para percepción visual o para entender algo.",
    examples: {
      base: { en: "I can see the mountains from here.", es: "Puedo ver las montañas desde aquí." },
      third: { en: "She sees the problem clearly.", es: "Ella ve el problema con claridad." },
      past: { en: "We saw a great movie.", es: "Vimos una gran película." },
      participle: { en: "The results have been seen by everyone.", es: "Los resultados han sido vistos por todos." },
      gerund: { en: "Seeing is believing.", es: "Ver para creer." },
    },
  },
  take: {
    usage: "Se usa para agarrar, llevar o necesitar tiempo para algo.",
    examples: {
      base: { en: "I will take the bus today.", es: "Tomaré el autobús hoy." },
      third: { en: "He takes the stairs every day.", es: "Él toma las escaleras todos los días." },
      past: { en: "She took a long vacation.", es: "Ella tomó unas largas vacaciones." },
      participle: { en: "The photo has been taken already.", es: "La foto ya ha sido tomada." },
      gerund: { en: "Taking risks can pay off.", es: "Tomar riesgos puede valer la pena." },
    },
  },
  think: {
    usage: "Se usa para expresar opiniones o procesos mentales.",
    examples: {
      base: { en: "I think this is a good idea.", es: "Creo que esta es una buena idea." },
      third: { en: "She thinks before she speaks.", es: "Ella piensa antes de hablar." },
      past: { en: "They thought about it carefully.", es: "Ellos lo pensaron con cuidado." },
      participle: { en: "It has been thought through already.", es: "Ya se ha pensado bien." },
      gerund: { en: "Thinking clearly helps you decide.", es: "Pensar con claridad te ayuda a decidir." },
    },
  },
};

// ============================================================
// Construcción final
// ============================================================
function buildVerb(base, past, participle, es, def, type) {
  const forms = {
    base,
    third: base === "be" ? "is" : base === "have" ? "has" : thirdPerson(base),
    past: past || regularPast(base),
    participle: participle || regularPast(base),
    gerund: gerund(base),
  };

  const override = OVERRIDES[base];
  const generated = buildExamples(base, forms, es);
  const examples = override?.examples
    ? { ...generated, ...override.examples }
    : generated;

  const usageTemplates = [
    (inf) => `Se usa en inglés para expresar la acción de ${inf}.`,
    (inf) => `Aparece en frases cotidianas relacionadas con ${inf}.`,
    (inf) => `Se emplea cuando se quiere comunicar la idea de ${inf}.`,
    (inf) => `Es común en el habla diaria al referirse a ${inf}.`,
  ];
  const inf = infinitiveOf(es);
  const usage = override?.usage || usageTemplates[hashStr(base + "u") % usageTemplates.length](inf);

  return {
    id: base,
    base,
    es,
    type,
    popular: POPULAR.includes(base),
    detailed: DETAILED.has(base),
    forms,
    definition: def,
    usage,
    examples,
  };
}

const all = [];
for (const [base, past, participle, es, def] of IRREGULAR) {
  all.push(buildVerb(base, past, participle, es, def, "irregular"));
}
for (const [base, es, def] of REGULAR) {
  all.push(buildVerb(base, null, null, es, def, "regular"));
}

all.sort((a, b) => a.base.localeCompare(b.base));

const outPath = path.join(__dirname, "..", "src", "data", "verbs.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(all, null, 2), "utf-8");

console.log(`Generados ${all.length} verbos -> ${outPath}`);
console.log(`Irregulares: ${all.filter((v) => v.type === "irregular").length}`);
console.log(`Regulares: ${all.filter((v) => v.type === "regular").length}`);
console.log(`Populares: ${all.filter((v) => v.popular).length}`);
console.log(`Detallados: ${all.filter((v) => v.detailed).length}`);
