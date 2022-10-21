const TOKEN = process.argv[3];

export function authentication(req: any, res: any, next: any) {
  if (TOKEN == req.query.token) {
    next();
  } else {
    console.log('TOKEN incorrect!');
    return res.status(401).json({ status: false, error: "Unauthorized token!", });
  }
}
