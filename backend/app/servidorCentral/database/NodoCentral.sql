-- Extensión para generación de UUIDs (usada en códigos QR)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Modifica la columna qr_code de envios para usar UUID y asignar un valor por defecto generado automáticamente
ALTER TABLE envios
  ALTER COLUMN qr_code TYPE UUID USING qr_code::UUID,
  ALTER COLUMN qr_code SET DEFAULT uuid_generate_v4();

-- ENUM para restringir los posibles estados de un envío
CREATE TYPE estado_envio AS ENUM (
  'CREADO',
  'EN_TRANSITO',
  'RECIBIDO',
  'VALIDADO',
  'ENTREGADO',
  'FALLIDO'
);

-- 1. Nodos locales registrado
CREATE TABLE nodos_locales (
  nodo_id         SERIAL PRIMARY KEY,
  nombre          VARCHAR(100)   NOT NULL,
  ip_registrada   INET           NOT NULL UNIQUE,
  validado        BOOLEAN        NOT NULL DEFAULT FALSE,
  fecha_registro  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- 2 Clientes
CREATE TABLE clientes (
  cliente_id   SERIAL        PRIMARY KEY,
  nombre       VARCHAR(150)  NOT NULL,
  cedula       VARCHAR(20)   NOT NULL UNIQUE,
  telefono     VARCHAR(20),
  correo       VARCHAR(150)  NOT NULL UNIQUE,
  fecha_alta   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- 3 Cuentas de clientes (saldo)
CREATE TABLE cuentas_clientes (
  cliente_id  INTEGER       PRIMARY KEY
                          REFERENCES clientes(cliente_id)
                            ON DELETE CASCADE,
  saldo       NUMERIC(12,2) NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- 4 Envíos (historial + QR)
CREATE TABLE envios (
  envio_id         SERIAL        PRIMARY KEY,
  cliente_id       INTEGER       NOT NULL
                            REFERENCES clientes(cliente_id),
  nodo_origen_id   INTEGER       NOT NULL
                            REFERENCES nodos_locales(nodo_id),
  nodo_destino_id  INTEGER       NOT NULL
                            REFERENCES nodos_locales(nodo_id),
  fecha_creacion   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  fecha_entrega    TIMESTAMPTZ,
  estado           estado_envio  NOT NULL DEFAULT 'CREADO',
  qr_code          UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_origen_destino CHECK (nodo_origen_id <> nodo_destino_id),
  CONSTRAINT chk_fecha_entrega  CHECK (
    fecha_entrega IS NULL OR fecha_entrega >= fecha_creacion
  )
);

select * from table envios

--5 Pagos por envío
CREATE TABLE pagos_envio (
  pago_id     SERIAL        PRIMARY KEY,
  envio_id    INTEGER       REFERENCES envios(envio_id) ON DELETE SET NULL,
  cliente_id  INTEGER       NOT NULL
                            REFERENCES clientes(cliente_id),
  monto       NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  fecha_pago  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Elimina el valor por defecto de qr_code y la extensión si ya no se requiere
ALTER TABLE envios
  ALTER COLUMN qr_code DROP DEFAULT;
DROP EXTENSION IF EXISTS "uuid-ossp";

--FUNCIONES Y TRIGGER PARA AUDITORIA:

-- 6 Función genérica para actualizar updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7) Triggers para actualizar updated_at automáticamente en cada tabla relevante
CREATE TRIGGER trg_nodos_updated_at
  BEFORE UPDATE ON nodos_locales
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_cuentas_updated_at
  BEFORE UPDATE ON cuentas_clientes
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_envios_updated_at
  BEFORE UPDATE ON envios
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_pagos_updated_at
  BEFORE UPDATE ON pagos_envio
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- 8 Trigger para ajustar el saldo de la cuenta tras cada pago registrado
CREATE OR REPLACE FUNCTION trg_update_saldo_after_pago()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cuentas_clientes
    SET saldo = saldo - NEW.monto
  WHERE cliente_id = NEW.cliente_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pagos_envio_update_saldo
  AFTER INSERT ON pagos_envio
  FOR EACH ROW EXECUTE PROCEDURE trg_update_saldo_after_pago();

-- Índices para optimizar joins y filtros comunes
CREATE INDEX ON envios(cliente_id);
CREATE INDEX ON envios(nodo_origen_id);
CREATE INDEX ON envios(nodo_destino_id);
CREATE INDEX ON envios(estado);
CREATE INDEX ON pagos_envio(cliente_id);
CREATE INDEX ON pagos_envio(envio_id);
CREATE INDEX ON nodos_locales(validado);


