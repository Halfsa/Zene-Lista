import { Body, Controller, Get, NotAcceptableException, Post, Redirect, Render } from '@nestjs/common';
import * as mysql from 'mysql2';
import { AppService } from './app.service';
import { UjZeneDto } from './ujZeneDto';

const conn = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'zenek',
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const [adatok, mezok] = await conn.execute('SELECT * FROM `zenelista` ORDER BY artist ASC, title ASC;');
    return { title: 'zenelista', zenek: adatok };
  }
  @Get('/ujzene')
  @Render('ujZene')
    ujZene() {
    return { title: 'Új zene felvétele' };
    }

  @Post('/ujzene')
  async form(@Body() ujZene: UjZeneDto) {
  const title = ujZene.title;
  const artist = ujZene.artist
  const length = ujZene.length;
  if (title.trim() == "") {
    throw new NotAcceptableException("Adja meg a szám címét!")
  }
  if (artist.trim() == "") {
    throw new NotAcceptableException("Adja meg a szám előadóját!")
  }
  if (length <=0) {
    throw new NotAcceptableException("A szám hossza nem megfelelő!")
  }
  await conn.execute(
    'INSERT INTO zenelista (title, artist, length) VALUES (?, ?, ?)',
    [title, artist, length],
  );
 

 return "sikeres felvétel!";
}

}

