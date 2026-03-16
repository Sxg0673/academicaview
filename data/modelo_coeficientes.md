# Coeficientes del Modelo de Regresión Múltiple

## Modelo seleccionado: modelo_2
Entrenado con base_imputada_knn.csv (n = 1220 estudiantes)

## Variable respuesta
puntaje_final — puntaje en prueba final (rango: 69.57 – 232.19, promedio: 140.89)

## Fórmula

puntaje = 64.5619
        + 1.6483  * horas_estudio
        + 5.5341  * promedio_previo
        - 1.6507  * horas_sueno
        + 7.5828  * (modalidad === 'Presencial' ? 1 : 0)
        + 0.2015  * asistencia
        - 1.3381  * uso_redes

## Métricas de ajuste
- R²          = 0.7440
- R² ajustado = 0.7428

## Rangos válidos de entrada
| Variable        | Mín   | Máx   | Promedio |
|-----------------|-------|-------|----------|
| horas_estudio   | 0.75  | 86.72 | 16.00    |
| promedio_previo | 2.40  | 9.99  | 7.94     |
| horas_sueno     | 3.27  | 8.47  | 6.16     |
| asistencia      | 45.11 | 99.94 | 79.76    |
| uso_redes       | 0.00  | 17.61 | 3.23     |
