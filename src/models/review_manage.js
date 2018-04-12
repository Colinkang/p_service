const {
  pool,
  queryFormat,
  P
} = require('./utils');
const uuidv4 = require('uuid/v4');
const KnownErrors = require('./error');

// 我要分享文章列表
let reviewShowList = async function (options) {
  let sql = queryFormat('select t2.nickname,t1.start_time,t1.end_time,t1.uuid,t1.title,t1.created_time,t1.first_type,t1.second_type,t1.address,t1.visit_count,t1.status,t1.stay_at_top from (select user_id, start_time,end_time,uuid,title,created_time,first_type,second_type,address,visit_count,status,stay_at_top from  tb_article where first_type = ?  order by created_time desc limit ?,?) t1 left join tb_member t2 on t1.user_id = t2.uuid', ['MEMBERSHOW', options.offset, options.count]);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from tb_article where first_type = ?', ['MEMBERSHOW']);
  let result = await P(pool, 'query', query);
  return {
    rows: rows,
    count: result[0].count
  };
};

// 极致驾客列表
let reviewdriverList = async function (options) {
  let sql = queryFormat('select t1.uuid,t1.title,t1.created_time,t1.address,t1.visit_count,t1.status,t2.nickname from  tb_article t1 left join tb_member t2 on t1.user_id = t2.uuid where t1.first_type = ?  order by t1.created_time desc', ['DRIVER']);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from tb_article where first_type = ?', ['DRIVER']);
  let result = await P(pool, 'query', query);
  return {
    rows: rows,
    count: result[0].count
  };
};

//文章置顶
let reviewShowTop = async function (options) {
  let query = queryFormat('select stay_at_top  from tb_article  where uuid = ?', [options.article_id]);
  let result = await P(pool, 'query', query);
  if (result.length > 0) {
    if (result[0].stay_at_top === 0) {
      let sql = queryFormat('update tb_article set stay_at_top = 1 where uuid = ?', [options.article_id]);
      await P(pool, 'query', sql);
    } else {
      let sql = queryFormat('update tb_article set stay_at_top = 0 where uuid = ?', [options.article_id]);
      await P(pool, 'query', sql);
    }
  }
};

// 文章审核通过
let reviewShowPass = async function (options) {
  let sql = queryFormat('update tb_article set status = ? where uuid = ?', ['ENABLED', options.article_id]);
  await P(pool, 'query', sql);
  let query = queryFormat('update tb_member_action set review_status = ? where article_id = ? and action = ?', ['Y', options.article_id, 'POST']);
  await P(pool, 'query', query);
};


//评论列表
let commentList = async function (options) {
  let sql = queryFormat('select t2.nickname,t1.created_time,t1.uuid,t1.content,t1.picture_path,t3.content as manager_reply,t1.title,t1.type from (select t3.uuid, t3.user_id,t3.content,t3.created_time,t3.picture_path,t4.title,t3.type from tb_article_comment t3  left join tb_article t4  on t3.article_id = t4.uuid where t3.article_id = ? and t3.user_type = ? limit ?,?) t1 left join tb_member t2 on t1.user_id = t2.uuid left join (select to_comment_id,content from tb_article_comment where user_type = ? ) t3 on t1.uuid = t3.to_comment_id', [options.article_id, 'MEMBER', parseInt(options.offset), parseInt(options.count), 'MANAGER']);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from tb_article_comment  where article_id = ? and user_type = ?', [options.article_id, 'MEMBER']);
  let result = await P(pool, 'query', query);
  return {
    rows: rows,
    count: result[0].count
  };
};

let commentReply = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_article_comment set uuid = ?, article_id = ?,user_id = ?,content = ?,to_comment_id = ?,created_time = ?,type = ?,user_type =?,comment_level = ?,picture_path = ?', [options.uuid, options.article_id, options.user_id, options.content, options.to_comment_id, time, options.type, 'MANAGER', 'SECOND', '']);
  await P(pool, 'query', sql);
};

// 删除评论
let deleteComment = async function (options) {
  let sql = queryFormat('delete from tb_article_comment where uuid = ?', [options.comment_id]);
  await P(pool, 'query', sql);
};

// 删除回复
let deleteReply = async function (options) {
  let sql = queryFormat('delete from tb_article_comment where to_comment_id = ? and user_type = ?', [options.to_comment_id, 'MANAGER']);
  await P(pool, 'query', sql);
};

//编辑活动
let driverEdit = async function (options) {
  // let time = new Date().getTime();
  let sql = queryFormat('update tb_article set title = ?,content = ?,picture_path = ?,status = ? where uuid = ?', [options.title, options.content, options.picture_path, options.status, options.article_id]);
  await P(pool, 'query', sql);
};

let driverDetail = async function (options) {
  let sql = queryFormat('select t1.title,t1.content,t1.picture_path,t1.status,t2.nickname from  tb_article t1 left join tb_member t2 on t1.user_id = t2.uuid where t1.uuid = ?', [options.article_id]);
  let result = await P(pool, 'query', sql);
  return result[0];
};

let driverAdd = async function (options) {
  let uuid = uuidv4();
  let time = new Date().getTime();
  let query = queryFormat('select uuid as member_id from tb_member where tel = ? and status = ?', [options.tel, 'REGISTERED']);
  let result = await P(pool, 'query', query);
  if (result.length === 0) throw new KnownErrors.ErrorNotFound();
  let member_id = result[0].member_id;

  let member_sql = queryFormat('select * from tb_article where user_id = ? and first_type = ?', [member_id, 'DRIVER']);
  let member_result = await P(pool, 'query', member_sql);
  if (member_result.length > 0) {
    let update_sql = queryFormat('update tb_article set created_time = ? where user_id = ? and first_type = ?', [time, member_id, 'DRIVER']);
    await P(pool, 'query', update_sql);
    throw new KnownErrors.ErrorAlreadyExist();
  }
  let sql = queryFormat('insert into tb_article set uuid = ?,user_id = ?,title = ?,content = ?,picture_path = ?,created_time = ?,status = ?,first_type = ?,second_type = ?,visit_count = ?,upvote_count = ?,user_type = ?', [uuid, member_id, options.title, options.content, options.picture_path, time, 'ENABLED', 'DRIVER', 'DRIVER', 0, 0, 'MEMBER']);
  await P(pool, 'query', sql);
};

let deleteArticle = async function (options) {
  let sql = queryFormat('delete from tb_article where uuid = ?', [options.article_id]);
  await P(pool, 'query', sql);
  let action_sql = queryFormat('delete from tb_member_action  where article_id = ?', [options.article_id]);
  await P(pool, 'query', action_sql);
};

let deleteDriver = async function (options) {
  let sql = queryFormat('delete from tb_article where uuid = ?', [options.article_id]);
  await P(pool, 'query', sql);
  let action_sql = queryFormat('delete from tb_member_action  where article_id = ?', [options.article_id]);
  await P(pool, 'query', action_sql);
};

let reviewShowDetail = async function (options) {
  let sql = queryFormat('select t1.title,t1.content,t1.status,t2.nickname from  tb_article t1 left join tb_member t2 on t1.user_id = t2.uuid where t1.uuid = ?', [options.article_id]);
  let result = await P(pool, 'query', sql);
  return result[0];
};

let reviewShowEdit = async function (options) {
  let sql = queryFormat('update tb_article set title = ?, content = ?,status = ? where uuid = ?', [options.title, options.content, options.status, options.article_id]);
  await P(pool, 'query', sql);
};

module.exports = {
  reviewShowList: reviewShowList,
  reviewdriverList: reviewdriverList,
  reviewShowTop: reviewShowTop,
  reviewShowPass: reviewShowPass,
  commentList: commentList,
  commentReply: commentReply,
  deleteComment: deleteComment,
  deleteReply: deleteReply,
  driverEdit: driverEdit,
  driverDetail: driverDetail,
  driverAdd: driverAdd,
  deleteArticle: deleteArticle,
  deleteDriver: deleteDriver,
  reviewShowDetail: reviewShowDetail,
  reviewShowEdit: reviewShowEdit
};