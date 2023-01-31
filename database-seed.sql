 CREATE TABLE users
 (
        id SERIAL,
        name text,
        email text,
        password text,
        CONSTRAINT users_pkey PRIMARY KEY (id)
 );

INSERT INTO users (name, email, password) 
VALUES ('John Doe', 'John@mail.fr', '123456');