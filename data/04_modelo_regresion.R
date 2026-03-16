rm(list = ls())

#---------------- librerías ----------------

library(ggplot2)
library(car)
library(lmtest)
library(gtsummary)
library(gt)


#---------------------cargar base imputada---------------------

base <- read.csv(
  "datos_limpios/base_imputada_knn.csv",
  stringsAsFactors = FALSE
)

cat("Dimensiones de la base:\n")
dim(base)

#----------convertir las varibles categoricas a factgor----------------

base$genero <- as.factor(base$genero)
base$carrera <- as.factor(base$carrera)
base$acceso_internet <- as.factor(base$acceso_internet)
base$trabaja <- as.factor(base$trabaja)
base$modalidad <- as.factor(base$modalidad)

base$modalidad <- relevel(base$modalidad, ref = "Virtual")# referencia para interpretar modalidad

#--------------------modelo base----------------------

modelo_1 <- lm(
  puntaje_final ~ horas_estudio + promedio_previo + horas_sueno + modalidad,
  data = base
)

cat("\nResumen del modelo 1:\n")
summary(modelo_1)



#---------------- residuos del modelo ----------------

error <- modelo_1$residuals
ajustados <- fitted(modelo_1)

#---------------- normalidad ----------------

cat("\nPrueba de Shapiro-Wilk para residuos:\n")
shapiro.test(error)

#---------------- homocedasticidad ----------------

cat("\nPrueba de Breusch-Pagan:\n")
bptest(modelo_1)

#---------------- multicolinealidad ----------------

cat("\nFactor de inflación de la varianza (VIF):\n")
vif(modelo_1)

#---------------- métricas de ajuste ----------------

ECM <- function(obs, pred){
  mean((obs - pred)^2)
}

EAM <- function(obs, pred){
  mean(abs(obs - pred))
}

RECM <- function(obs, pred){
  sqrt(mean((obs - pred)^2))
}

cat("\nECM del modelo 1:\n")
ECM(base$puntaje_final, ajustados)

cat("\nEAM del modelo 1:\n")
EAM(base$puntaje_final, ajustados)

cat("\nRECM del modelo 1:\n")
RECM(base$puntaje_final, ajustados)







#---------------- base de diagnóstico ----------------

diag_modelo_1 <- data.frame(
  ajustados = fitted(modelo_1),
  residuos = residuals(modelo_1),
  residuos_std = rstandard(modelo_1),
  cook = cooks.distance(modelo_1)
)

#---------------- residuos vs ajustados ----------------

g_res_aj <- ggplot(diag_modelo_1, aes(x = ajustados, y = residuos)) +
  geom_point(alpha = 0.4) +
  geom_smooth(se = FALSE) +
  geom_hline(yintercept = 0, linetype = "dashed") +
  labs(
    title = "Residuos vs valores ajustados",
    x = "Valores ajustados",
    y = "Residuos"
  ) +
  theme_minimal()

#---------------- qq plot ----------------

g_qq <- ggplot(diag_modelo_1, aes(sample = residuos_std)) +
  stat_qq(alpha = 0.4) +
  stat_qq_line() +
  labs(
    title = "QQ plot de residuos estandarizados",
    x = "Cuantiles teóricos",
    y = "Cuantiles muestrales"
  ) +
  theme_minimal()

#---------------- histograma de residuos ----------------

g_hist_res <- ggplot(diag_modelo_1, aes(x = residuos)) +
  geom_histogram(bins = 30) +
  labs(
    title = "Histograma de residuos",
    x = "Residuos",
    y = "Frecuencia"
  ) +
  theme_minimal()

#---------------- distancia de Cook ----------------

diag_modelo_1$id <- 1:nrow(diag_modelo_1)

g_cook <- ggplot(diag_modelo_1, aes(x = id, y = cook)) +
  geom_col() +
  labs(
    title = "Distancia de Cook",
    x = "Observación",
    y = "Cook's distance"
  ) +
  theme_minimal()

#---------------- mostrar gráficos ----------------

g_res_aj
g_qq
g_hist_res
g_cook

#---------------- guardar gráficos ----------------

ggsave(
  filename = "graficas/modelo1_residuos_vs_ajustados.png",
  plot = g_res_aj,
  width = 8,
  height = 6,
  dpi = 300
)

ggsave(
  filename = "graficas/modelo1_qqplot_residuos.png",
  plot = g_qq,
  width = 8,
  height = 6,
  dpi = 300
)

ggsave(
  filename = "graficas/modelo1_histograma_residuos.png",
  plot = g_hist_res,
  width = 8,
  height = 6,
  dpi = 300
)

ggsave(
  filename = "graficas/modelo1_cooks_distance.png",
  plot = g_cook,
  width = 9,
  height = 6,
  dpi = 300
)


#===========================================
#============== modelo 2 ===================
#===========================================

modelo_2 <- lm(
  puntaje_final ~ horas_estudio + promedio_previo + horas_sueno +
    modalidad + asistencia + uso_redes,
  data = base
)

cat("\nResumen del modelo 2:\n")
summary(modelo_2)

#---------------- comparacion ANOVA ----------------

cat("\nComparacion ANOVA entre modelo 1 y modelo 2:\n")
anova(modelo_1, modelo_2)

#---------------- metricas modelo 2 ----------------

ajustados_2 <- fitted(modelo_2)

cat("\nECM del modelo 2:\n")
ECM(base$puntaje_final, ajustados_2)

cat("\nEAM del modelo 2:\n")
EAM(base$puntaje_final, ajustados_2)

cat("\nRECM del modelo 2:\n")
RECM(base$puntaje_final, ajustados_2)

#---------------- tabla comparativa ----------------

comparacion_m1_m2 <- data.frame(
  modelo = c("Modelo_1", "Modelo_2"),
  AIC = c(AIC(modelo_1), AIC(modelo_2)),
  BIC = c(BIC(modelo_1), BIC(modelo_2)),
  R2 = c(summary(modelo_1)$r.squared, summary(modelo_2)$r.squared),
  R2_ajustado = c(summary(modelo_1)$adj.r.squared, summary(modelo_2)$adj.r.squared),
  ECM = c(
    ECM(base$puntaje_final, fitted(modelo_1)),
    ECM(base$puntaje_final, fitted(modelo_2))
  ),
  RECM = c(
    RECM(base$puntaje_final, fitted(modelo_1)),
    RECM(base$puntaje_final, fitted(modelo_2))
  ),
  MAE = c(
    EAM(base$puntaje_final, fitted(modelo_1)),
    EAM(base$puntaje_final, fitted(modelo_2))
  )
)

cat("\nComparacion de metricas entre modelo 1 y modelo 2:\n")
comparacion_m1_m2


#==============================================
#======= diagnostico final modelo 2 ===========
#==============================================

#---------------- residuos y ajustados ----------------

error_2 <- modelo_2$residuals
ajustados_2 <- fitted(modelo_2)

#---------------- normalidad ----------------

cat("\nPrueba de Shapiro-Wilk para residuos del modelo 2:\n")
shapiro.test(error_2)

#---------------- homocedasticidad ----------------

cat("\nPrueba de Breusch-Pagan para modelo 2:\n")
bptest(modelo_2)

#---------------- multicolinealidad ----------------

cat("\nFactor de inflación de la varianza (VIF) del modelo 2:\n")
vif(modelo_2)

#---------------- métricas del modelo 2 ----------------

cat("\nECM del modelo 2:\n")
ECM(base$puntaje_final, ajustados_2)

cat("\nEAM del modelo 2:\n")
EAM(base$puntaje_final, ajustados_2)

cat("\nRECM del modelo 2:\n")
RECM(base$puntaje_final, ajustados_2)

#---------------- base de diagnóstico ----------------

diag_modelo_2 <- data.frame(
  ajustados = fitted(modelo_2),
  residuos = residuals(modelo_2),
  residuos_std = rstandard(modelo_2),
  cook = cooks.distance(modelo_2)
)

diag_modelo_2$id <- 1:nrow(diag_modelo_2)

#---------------- residuos vs ajustados ----------------

g_res_aj_2 <- ggplot(diag_modelo_2, aes(x = ajustados, y = residuos)) +
  geom_point(alpha = 0.4) +
  geom_smooth(se = FALSE) +
  geom_hline(yintercept = 0, linetype = "dashed") +
  labs(
    title = "Residuos vs ajustados - Modelo 2",
    x = "Valores ajustados",
    y = "Residuos"
  ) +
  theme_minimal()

#---------------- qq plot ----------------

g_qq_2 <- ggplot(diag_modelo_2, aes(sample = residuos_std)) +
  stat_qq(alpha = 0.4) +
  stat_qq_line() +
  labs(
    title = "QQ plot residuos estandarizados - Modelo 2",
    x = "Cuantiles teóricos",
    y = "Cuantiles muestrales"
  ) +
  theme_minimal()

#---------------- histograma de residuos ----------------

g_hist_res_2 <- ggplot(diag_modelo_2, aes(x = residuos)) +
  geom_histogram(bins = 30) +
  labs(
    title = "Histograma de residuos - Modelo 2",
    x = "Residuos",
    y = "Frecuencia"
  ) +
  theme_minimal()

#---------------- distancia de Cook ----------------

g_cook_2 <- ggplot(diag_modelo_2, aes(x = id, y = cook)) +
  geom_col() +
  labs(
    title = "Distancia de Cook - Modelo 2",
    x = "Observación",
    y = "Cook's distance"
  ) +
  theme_minimal()

#---------------- mostrar gráficos ----------------

g_res_aj_2
g_qq_2
g_hist_res_2
g_cook_2

#---------------- guardar gráficos ----------------

ggsave(
  filename = "graficas/modelo2_residuos_vs_ajustados.png",
  plot = g_res_aj_2,
  width = 8,
  height = 6,
  dpi = 300
)

ggsave(
  filename = "graficas/modelo2_qqplot_residuos.png",
  plot = g_qq_2,
  width = 8,
  height = 6,
  dpi = 300
)

ggsave(
  filename = "graficas/modelo2_histograma_residuos.png",
  plot = g_hist_res_2,
  width = 8,
  height = 6,
  dpi = 300
)

ggsave(
  filename = "graficas/modelo2_cooks_distance.png",
  plot = g_cook_2,
  width = 9,
  height = 6,
  dpi = 300
)


#===========================================
#======== tabla coeficientes modelo 2 ======
#===========================================

tabla_modelo_2 <- tbl_regression(
  modelo_2,
  label = list(
    horas_estudio   ~ "Horas de estudio",
    promedio_previo ~ "Promedio previo",
    horas_sueno     ~ "Horas de sueño",
    modalidad       ~ "Modalidad",
    asistencia      ~ "Asistencia",
    uso_redes       ~ "Uso de redes"
  )
) |>
  bold_p() |>
  bold_labels()

tabla_modelo_2

tabla_modelo_2 |>
  as_gt() |>
  gt::gtsave("tablas/tabla_coeficientes_modelo_2.html")


#==============================================
#====== tabla comparativa de modelos =========
#==============================================

tabla_comparacion_modelos <- comparacion_m1_m2 |>
  gt()

tabla_comparacion_modelos

gt::gtsave(
  data = tabla_comparacion_modelos,
  filename = "tablas/tabla_comparacion_modelos.html"
)




#===========================================
#====== tabla diagnostico modelo 2 =========
#===========================================

shapiro_m2 <- shapiro.test(error_2)
bp_m2 <- bptest(modelo_2)
vif_m2 <- vif(modelo_2)

tabla_diagnostico_m2 <- data.frame(
  Indicador = c(
    "R cuadrado",
    "R cuadrado ajustado",
    "ECM",
    "RECM",
    "MAE",
    "Shapiro-Wilk W",
    "Shapiro-Wilk p-valor",
    "Breusch-Pagan BP",
    "Breusch-Pagan p-valor",
    "VIF máximo"
  ),
  Valor = c(
    summary(modelo_2)$r.squared,
    summary(modelo_2)$adj.r.squared,
    ECM(base$puntaje_final, fitted(modelo_2)),
    RECM(base$puntaje_final, fitted(modelo_2)),
    EAM(base$puntaje_final, fitted(modelo_2)),
    unname(shapiro_m2$statistic),
    shapiro_m2$p.value,
    unname(bp_m2$statistic),
    bp_m2$p.value,
    max(vif_m2)
  )
)

tabla_diagnostico_m2$Valor <- round(tabla_diagnostico_m2$Valor, 4)

tabla_diagnostico_m2_gt <- gt::gt(tabla_diagnostico_m2)

tabla_diagnostico_m2_gt

gt::gtsave(
  tabla_diagnostico_m2_gt,
  "tablas/tabla_diagnostico_modelo_2.html"
)

