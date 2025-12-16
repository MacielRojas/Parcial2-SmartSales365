import React, { useEffect, useRef, useState } from 'react';
import { Card, Form, Button, Alert, Badge } from 'react-bootstrap';

interface ReporteLenguajeNaturalProps {
  onGenerate: (query: string) => Promise<void>;
  loading: boolean;
}

const ReporteLenguajeNatural: React.FC<ReporteLenguajeNaturalProps> = ({ 
  onGenerate, 
  loading 
}) => {
  const [query, setQuery] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  const ejemplos = [
    "Mostrar las ventas del último mes agrupadas por categoría",
    "Top 10 productos más vendidos en el último trimestre",
    "Usuarios registrados por mes del año actual",
    "Ventas totales por día de la semana",
    "Productos con stock bajo (menos de 10 unidades)",
    "Comparativa de ventas entre este mes y el mes anterior",
    "Clientes con más compras en los últimos 6 meses",
    "Productos que nunca se han vendido",
    "Tendencia de ventas por hora del día",
    "Categorías con mejor margen de ganancia"
  ];

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    setIsSpeechSupported(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setError('');
      setInterimTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      // Mostrar el texto final en el campo query
      if (final.trim()) {
        setQuery((prev) => {
          const base = prev?.trim() ? prev.trim() + ' ' : '';
          return (base + final.trim()).trim();
        });
      }

      // Mostrar el texto provisional mientras se dicta
      setInterimTranscript(interim);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript('');
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      setInterimTranscript('');
      if (event.error !== 'no-speech') {
        setError(`Error en el reconocimiento de voz: ${event.error}`);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!isSpeechSupported || loading) return;
    
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (!isRecording) {
      try {
        recognition.start();
      } catch (_) {
        // Ya está iniciado
      }
    } else {
      try {
        recognition.stop();
      } catch (_) {}
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!query.trim()) {
      setError('Por favor, ingresa una consulta en lenguaje natural');
      return;
    }

    if (query.trim().length < 10) {
      setError('La consulta es muy corta. Sé más específico para mejores resultados');
      return;
    }

    try {
      await onGenerate(query.trim());
    } catch (err) {
      setError('Error al generar el reporte. Intenta con otra consulta.');
    }
  };

  const insertarEjemplo = (ejemplo: string) => {
    setQuery(ejemplo);
    setError('');
  };

  const clearQuery = () => {
    setQuery('');
    setInterimTranscript('');
    setError('');
  };

  // Mostrar el texto final + provisional mientras se dicta
  const displayText = query + (interimTranscript ? ' ' + interimTranscript : '');

  return (
    <Card className="h-100">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-chat-left-text me-2"></i>
          Reportes con Lenguaje Natural
        </h5>
        <small className="opacity-75">
          Describe lo que quieres analizar y nuestro sistema lo convertirá en un reporte
        </small>
      </Card.Header>
      
      <Card.Body>
        {error && (
          <Alert variant="danger" className="py-2">
            <small>{error}</small>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Describe tu reporte:
              <Badge bg="info" className="ms-2" text="dark">Beta</Badge>
            </Form.Label>
            <div className="position-relative">
              <Form.Control
                as="textarea"
                rows={4}
                value={displayText}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ejemplo: Mostrar las ventas totales por categoría del mes actual, ordenadas de mayor a menor..."
                className="border-primary pe-5"
                style={{ 
                  resize: 'none',
                  fontStyle: interimTranscript ? 'italic' : 'normal',
                  opacity: interimTranscript ? 0.9 : 1
                }}
                disabled={loading}
              />
              <Button
                type="button"
                variant={isRecording ? 'danger' : 'outline-secondary'}
                onClick={toggleRecording}
                disabled={!isSpeechSupported || loading}
                className="position-absolute"
                style={{ right: 8, bottom: 8 }}
                title={isSpeechSupported ? (isRecording ? 'Detener dictado' : 'Dictar por voz') : 'Dictado por voz no soportado en este navegador'}
              >
                <i className={`bi ${isRecording ? 'bi-stop-fill' : 'bi-mic'}`}></i>
              </Button>
            </div>
            <Form.Text className="text-muted">
              Sé específico incluyendo métricas, periodos de tiempo y criterios de ordenamiento
            </Form.Text>
          </Form.Group>

          <div className="d-grid gap-2 d-sm-flex justify-content-sm-between align-items-center">
            <div className="text-muted small">
              {!isSpeechSupported && (
                <span>
                  <i className="bi bi-info-circle me-1"></i>
                  El dictado por voz no es soportado por este navegador.
                </span>
              )}
              {isSpeechSupported && (
                <span>
                  <i className="bi bi-mic me-1"></i>
                  {isRecording ? 'Escuchando... habla ahora' : 'Puedes dictar tu consulta por voz'}
                </span>
              )}
            </div>
            <div className="d-flex gap-2">
              {query.trim() && (
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={clearQuery}
                  disabled={loading}
                  className="fw-semibold"
                >
                  <i className="bi bi-x me-1"></i>
                  Limpiar
                </Button>
              )}
              <Button
                variant="primary"
                type="submit"
                disabled={loading || !query.trim()}
                className="fw-semibold"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Procesando consulta...
                  </>
                ) : (
                  <>
                    <i className="bi bi-magic me-2"></i>
                    Generar Reporte Inteligente
                  </>
                )}
              </Button>
            </div>
          </div>
        </Form>

        <div className="mt-4">
          <h6 className="text-muted mb-3">
            <i className="bi bi-lightbulb me-1"></i>
            Ejemplos de consultas:
          </h6>
          <div className="d-flex flex-wrap gap-2">
            {ejemplos.map((ejemplo, index) => (
              <Badge
                key={index}
                bg="outline-primary"
                className="cursor-pointer ejemplo-badge"
                onClick={() => insertarEjemplo(ejemplo)}
                style={{ 
                  cursor: 'pointer',
                  border: '1px solid #0d6efd',
                  color: '#0d6efd',
                  background: 'transparent'
                }}
              >
                {ejemplo}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-3 p-3 bg-light rounded">
          <small className="text-muted">
            <strong>Tip:</strong> Nuestro sistema AI entiende consultas complejas como 
            "ventas por categoría último mes", "productos más rentables", 
            "comparativa mensual de ingresos", etc.
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReporteLenguajeNatural;
