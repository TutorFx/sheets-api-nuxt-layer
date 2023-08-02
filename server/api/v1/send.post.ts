import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const auth = new google.auth.JWT(
      process.env.client_email,
      undefined,
      process.env.private_key?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive']
    )

    const sheets = google.sheets({ version: 'v4', auth });
    // @ts-expect-error
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Cadastro!A3',
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [body.nome, body.celular, body.email, new Date]
        ]
      }
    });
    return { message: 'Sucesso!' }
  } catch (err) {
    console.log(err)
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: 'Erro ao cadastrar!'
      })
    );
  }
})