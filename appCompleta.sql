use empresautn;

create table productos(
idProducto int unsigned not null auto_increment,
nombre varchar(150) not null,
precio int not null,
descripcion varchar (200) not null,
primary key (idProducto));
-- creamos la tabala contacto para la app completa

create table contacto(
idContacto int unsigned not null auto_increment,
nombre varchar(150) not null,
email varchar (100) not null,
primary key (idContacto));