# Cómo
El archivo `*.als` de ableton es un `.xml` comprimido en zip.
Para su lectura:
1. Se cambia la extensión a `.zip`
2. Se descomprime
3. Se cambia el formato a `.xml`

# Errores
Se ha desarrollado en un fichero **guardado con Ableton 11**, el cual tiene cambios con Ableton 12, los que he encontrado por cambio de versión ahora mismo son:
- Cambio de nomenclatura **master** -> **main**

## Principio y final de la canción
El principio de la canción se encuentra en: `Transport> LoopStart > Value` (en Beats) y la duración `Transport> LoopLength`, si esto no se encontrase se debería tomar el **Beat 0** como inicio y el final de la última canción como final (TODO:). 


## Song Tempo
Se puede encontrar en:
```
  Ableton>
    LiveSet>
      (Master|Main)Track>
        AutomationEnvelopes>
          Envelopes>
            AutomationEnvelope[0]> 
              # No parece tener info relevante
            AutomationEnvelope[1]>
              Automation>
                Events>
                  FloatEvent[0]> # El tiempo está en negativo, lo corregimos
                  FloatEvent[x]> 
                    Time> # El beat del punto
                    Value> # BPM del punto
```
De aquí se sacarán los RPM de cada punto de la gráfica.
Es importante sacar esto primero ya que nos dice el tiempo en cada beat.

## Locators
Esto lo marcan los instructores en el Ableton, son como puntos de referencia a los que pueden dar nombres, se convertirán en los puntos de la gráfica. Para ver el tiempo nos referimos a lo extraído desde SongTempo.
Cuando tengamos un Locator, hay que localizar:
 - La primera canción que recaiga sobre ese tiempo (que más tarde TODO:)




