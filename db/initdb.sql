CREATE DATABASE makoto;
\c makoto;

-- public.asset definition

-- Drop table

-- DROP TABLE public.asset;

CREATE TABLE public.asset (
	id serial4 NOT NULL,
	"ownerUid" int4 NOT NULL,
	"storePath" varchar NOT NULL,
	mimetype varchar NOT NULL,
	ctime timestamp NOT NULL,
	CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY (id)
);


-- public.chat definition

-- Drop table

-- DROP TABLE public.chat;

CREATE TABLE public.chat (
	id serial4 NOT NULL,
	room varchar NOT NULL,
	"content" varchar NOT NULL,
	uid int4 NOT NULL,
	ctime timestamp NOT NULL,
	CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY (id)
);


-- public."document" definition

-- Drop table

-- DROP TABLE public."document";

CREATE TABLE public."document" (
	fid int4 NOT NULL,
	"data" bytea NOT NULL,
	CONSTRAINT "PK_c9fde0e2518c177c657d6b80f25" PRIMARY KEY (fid)
);


-- public.refresh_token definition

-- Drop table

-- DROP TABLE public.refresh_token;

CREATE TABLE public.refresh_token (
	"refreshToken" varchar NOT NULL,
	uid int4 NOT NULL,
	CONSTRAINT "PK_428e14ded7299edfcf58918beaf" PRIMARY KEY ("refreshToken")
);


-- public."user" definition

-- Drop table

-- DROP TABLE public."user";

CREATE TABLE public."user" (
	uid serial4 NOT NULL,
	username varchar(24) NOT NULL,
	"password" varchar(128) NOT NULL,
	nickname varchar(24) NOT NULL,
	CONSTRAINT "PK_df955cae05f17b2bcf5045cc021" PRIMARY KEY (uid)
);
CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON public."user" USING btree (username);


-- public."share" definition

-- Drop table

-- DROP TABLE public."share";

CREATE TABLE public."share" (
	id serial4 NOT NULL,
	title varchar NOT NULL,
	"ownerUid" int4 NOT NULL,
	"permission" int4 NOT NULL,
	"allowLink" bool NOT NULL,
	ctime timestamp NOT NULL,
	etime timestamp NOT NULL,
	CONSTRAINT "PK_67a2b28d2cff31834bc2aa1ed7c" PRIMARY KEY (id),
	CONSTRAINT "FK_88dc043c1ade587537e02da8c72" FOREIGN KEY ("ownerUid") REFERENCES public."user"(uid)
);


-- public.share_access_record definition

-- Drop table

-- DROP TABLE public.share_access_record;

CREATE TABLE public.share_access_record (
	uid int4 NOT NULL,
	"shareId" int4 NOT NULL,
	ctime timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "PK_820a8ceba7d6a50a3b18ad42a57" PRIMARY KEY (uid, "shareId"),
	CONSTRAINT "FK_c892a5bf3073dc2ebbf6565cfcd" FOREIGN KEY ("shareId") REFERENCES public."share"(id)
);


-- public.share_fav definition

-- Drop table

-- DROP TABLE public.share_fav;

CREATE TABLE public.share_fav (
	uid int4 NOT NULL,
	"shareId" int4 NOT NULL,
	ctime timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "PK_85edd70e2eb943f84137e4bc1bc" PRIMARY KEY (uid, "shareId"),
	CONSTRAINT "FK_d2558cf12436598b74331bfcf57" FOREIGN KEY ("shareId") REFERENCES public."share"(id)
);


-- public.file definition

-- Drop table

-- DROP TABLE public.file;

CREATE TABLE public.file (
	fid serial4 NOT NULL,
	uid int4 NOT NULL,
	filename varchar NOT NULL,
	"type" varchar NOT NULL,
	"parentFid" int4 NULL,
	"recycleBinEntityId" int4 NULL,
	"lastModifyUserUid" int4 NOT NULL,
	ctime timestamp NOT NULL DEFAULT now(),
	mtime timestamp NOT NULL DEFAULT now(),
	atime timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "PK_8f81f4a8d4e67c4a1df600d68d0" PRIMARY KEY (fid),
	CONSTRAINT "REL_12512793fa6568e6ec30424d02" UNIQUE ("recycleBinEntityId")
);


-- public.file_link definition

-- Drop table

-- DROP TABLE public.file_link;

CREATE TABLE public.file_link (
	fid int4 NOT NULL,
	"refFid" int4 NULL,
	"permission" int4 NOT NULL,
	CONSTRAINT "PK_9e1c4712077006d4db102549bf4" PRIMARY KEY (fid)
);


-- public.recycle_bin_entity definition

-- Drop table

-- DROP TABLE public.recycle_bin_entity;

CREATE TABLE public.recycle_bin_entity (
	id serial4 NOT NULL,
	fid int4 NOT NULL,
	uid int4 NOT NULL,
	"path" varchar NOT NULL,
	ctime timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "PK_2101922c6964d08d6d95a8421b7" PRIMARY KEY (id),
	CONSTRAINT "REL_f80359d47203bcd7f82a0e6f64" UNIQUE (fid)
);


-- public.share_files definition

-- Drop table

-- DROP TABLE public.share_files;

CREATE TABLE public.share_files (
	"shareId" int4 NOT NULL,
	"fileFid" int4 NOT NULL,
	CONSTRAINT "PK_c1cd0a8552c7ecb40a63f45e49a" PRIMARY KEY ("shareId", "fileFid")
);
CREATE INDEX "IDX_57c11a8cb2b80c54be3037dbe3" ON public.share_files USING btree ("shareId");
CREATE INDEX "IDX_bf7ae7c06ab40509fa6bd2485b" ON public.share_files USING btree ("fileFid");


-- public.file foreign keys

ALTER TABLE public.file ADD CONSTRAINT "FK_12512793fa6568e6ec30424d026" FOREIGN KEY ("recycleBinEntityId") REFERENCES public.recycle_bin_entity(id) ON DELETE SET NULL;
ALTER TABLE public.file ADD CONSTRAINT "FK_714c921b341d142336b5e758189" FOREIGN KEY ("lastModifyUserUid") REFERENCES public."user"(uid) ON DELETE RESTRICT;
ALTER TABLE public.file ADD CONSTRAINT "FK_c2d80253a727851ba261d7f13e4" FOREIGN KEY ("parentFid") REFERENCES public.file(fid) ON DELETE CASCADE;


-- public.file_link foreign keys

ALTER TABLE public.file_link ADD CONSTRAINT "FK_59f20d4fc54d6fdf355ec9380e6" FOREIGN KEY ("refFid") REFERENCES public.file(fid) ON DELETE RESTRICT;
ALTER TABLE public.file_link ADD CONSTRAINT "FK_9e1c4712077006d4db102549bf4" FOREIGN KEY (fid) REFERENCES public.file(fid) ON DELETE CASCADE;


-- public.recycle_bin_entity foreign keys

ALTER TABLE public.recycle_bin_entity ADD CONSTRAINT "FK_f80359d47203bcd7f82a0e6f648" FOREIGN KEY (fid) REFERENCES public.file(fid) ON DELETE CASCADE;


-- public.share_files foreign keys

ALTER TABLE public.share_files ADD CONSTRAINT "FK_57c11a8cb2b80c54be3037dbe39" FOREIGN KEY ("shareId") REFERENCES public."share"(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public.share_files ADD CONSTRAINT "FK_bf7ae7c06ab40509fa6bd2485b2" FOREIGN KEY ("fileFid") REFERENCES public.file(fid) ON DELETE CASCADE ON UPDATE CASCADE;