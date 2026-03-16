import csv
import random

random.seed(42)

INPUT  = "base_imputada_knn.csv"
OUTPUT = "seed_estudiantes.sql"

NOMBRES = [
    ("Carlos", "Mendoza"), ("Laura", "Garcia"), ("Andres", "Lopez"),
    ("Valentina", "Martinez"), ("Santiago", "Rodriguez"), ("Camila", "Perez"),
    ("Daniel", "Gomez"), ("Isabella", "Herrera"), ("Sebastian", "Torres"),
    ("Mariana", "Vargas"), ("Felipe", "Castro"), ("Natalia", "Morales"),
    ("Julian", "Ortiz"), ("Sara", "Ramirez"), ("Miguel", "Flores"),
    ("Alejandra", "Ruiz"), ("Tomas", "Jimenez"), ("Daniela", "Reyes"),
    ("Juan", "Alvarez"), ("Paula", "Sanchez"), ("Mateo", "Diaz"),
    ("Gabriela", "Torres"), ("David", "Nunez"), ("Sofia", "Vega"),
    ("Nicolas", "Romero"), ("Valeria", "Mendez"), ("Luis", "Suarez"),
    ("Ana", "Guerrero"), ("Jorge", "Munoz"), ("Carolina", "Delgado")
]

with open(INPUT, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    filas = list(reader)

seleccionadas = random.sample(filas, 30)

with open(OUTPUT, 'w', encoding='utf-8') as out:
    out.write("-- Seed: 30 estudiantes reales anonimizados\n")
    out.write("-- Generado desde base_imputada_knn.csv\n\n")

    # INSERT usuarios (password = 'estudiante123' en texto plano por ahora)
    out.write("INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES\n")
    u_lineas = []
    for (nombre, apellido) in NOMBRES:
        email = f"{nombre.lower()}.{apellido.lower()}@academicaview.edu"
        u_lineas.append(
            f"  ('{nombre}', '{apellido}', '{email}', 'estudiante123', 'estudiante')"
        )
    out.write(",\n".join(u_lineas) + ";\n\n")

    # INSERT estudiantes con usuario_id del 1 al 30
    out.write("INSERT INTO estudiantes "
              "(usuario_id, nombre, apellido, email, horas_estudio, promedio_previo, "
              "horas_sueno, modalidad, asistencia, uso_redes, puntaje_real) VALUES\n")
    e_lineas = []
    for i, (fila, (nombre, apellido)) in enumerate(zip(seleccionadas, NOMBRES)):
        email   = f"{nombre.lower()}.{apellido.lower()}@academicaview.edu"
        uid     = i + 1
        he      = round(float(fila["horas_estudio"]), 2)
        pp      = round(float(fila["promedio_previo"]), 2)
        hs      = round(float(fila["horas_sueno"]), 2)
        mod     = fila["modalidad"].strip().strip('"')
        asi     = round(float(fila["asistencia"]), 2)
        ur      = round(float(fila["uso_redes"]), 2)
        pf      = round(float(fila["puntaje_final"]), 2)
        e_lineas.append(
            f"  ({uid}, '{nombre}', '{apellido}', '{email}', "
            f"{he}, {pp}, {hs}, '{mod}', {asi}, {ur}, {pf})"
        )
    out.write(",\n".join(e_lineas) + ";\n")

print(f"Archivo generado: {OUTPUT}")
print(f"Usuarios insertados: {len(u_lineas)}")
print(f"Estudiantes insertados: {len(e_lineas)}")
