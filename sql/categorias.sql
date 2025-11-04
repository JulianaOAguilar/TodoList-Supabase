CREATE TABLE categorias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome text NOT NULL
);

