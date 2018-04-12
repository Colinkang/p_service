const {
  pool,
  queryFormat,
  P
} = require('./utils');

// 创建活动
let activityCreate = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_article set uuid = ?, user_id = ?,title = ?,content = ?,picture_path = ?,city = ?,address = ?,start_time = ?,end_time = ?,created_time = ?,first_type = ?,second_type = ?,user_type = ?,visit_count = ?,join_count = ?,upvote_count = ?,status = ?', [options.uuid, options.user_id, options.title, options.content, options.picture_path, options.city, options.address, options.start_time, options.end_time, time, options.first_type, options.second_type, 'MANAGER', 0, 0, 0, 'ENABLED']);
  await P(pool, 'query', sql);
};

//活动列表管理
let activityList = async function (options) {
  let sql = queryFormat('select start_time,end_time,uuid,title,content,picture_path,created_time,start_time,end_time,first_type,second_type,address,city,visit_count,join_count,upvote_count from  tb_article  where first_type = ? or first_type = ?  order by created_time desc  limit ?,?', ['FM', 'OFFLINE', parseInt(options.offset), parseInt(options.count)]);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from  tb_article where first_type = ? or first_type= ?', ['FM', 'OFFLINE']);
  let result = await P(pool, 'query', query);
  return {
    rows: rows,
    count: result[0].count
  };
};

let activityDetail = async function (options) {
  let sql = queryFormat('select * from  tb_article where uuid = ?', [options.article_id]);
  let result = await P(pool, 'query', sql);
  return result[0];
};

//参加人员列表
let activityUserList = async function (options) {
  let wherestr = '';
  if (options.nickname) {
    let key = '%' + options.nickname + '%';
    wherestr += queryFormat(' and t2.nickname like ? ', [key]);
  }
  if (options.tel) {
    wherestr += queryFormat(' and t2.tel = ?', [options.tel]);
  }
  let sql = queryFormat(' select t1.member_id,t2.nickname,t2.tel,t1.created_time from  (select member_id,created_time from tb_member_action  where article_id =? and action = ?) t1 inner join tb_member t2 on t1.member_id = t2.uuid ' + wherestr + ' limit ?,?', [options.article_id, 'JOIN', parseInt(options.offset), parseInt(options.count)]);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from  (select member_id,created_time from tb_member_action  where article_id =? and action = ?) t1 left join tb_member t2 on t1.member_id = t2.uuid  ' + wherestr, [options.article_id, 'JOIN']);
  let result = await P(pool, 'query', query);

  return {
    rows: rows,
    count: result[0].count
  };
};


//评论列表
let activityCommentList = async function (options) {
  let sql = queryFormat('select t2.nickname,t1.created_time,t1.uuid,t1.content,t1.picture_path,t3.content as manager_reply,t1.type from (select uuid, user_id,content,created_time,picture_path,type from tb_article_comment  where article_id = ? and user_type = ? limit ?,?) t1 left join tb_member t2 on t1.user_id = t2.uuid left join (select to_comment_id,content from tb_article_comment where user_type = ? ) t3 on t1.uuid = t3.to_comment_id', [options.article_id, 'MEMBER', parseInt(options.offset), parseInt(options.count), 'MANAGER']);
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
  let sql = queryFormat('delete from tb_article_comment where to_comment_id = ? and user_type = ?', [options.comment_id, 'MANAGER']);
  await P(pool, 'query', sql);
};

//编辑活动
let activityEdit = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('update tb_article set title = ?,content = ?,picture_path = ?,address = ?,start_time = ?,end_time = ?,created_time = ?,first_type = ?,second_type = ? where uuid = ?', [options.title, options.content, options.picture_path, options.address, options.start_time, options.end_time, time, options.first_type, options.second_type, options.article_id]);
  await P(pool, 'query', sql);
};

//删除活动
let activityDelete = async function (options) {
  let sql = queryFormat('delete from tb_article  where uuid = ?', [options.article_id]);
  await P(pool, 'query', sql);
  let action_sql = queryFormat('delete from tb_member_action  where article_id = ?', [options.article_id]);
  await P(pool, 'query', action_sql);
};

//活动参与人员
let activityUserExport = async function (options) {
  let sql = queryFormat(' select t1.member_id,t2.firstname,t2.surname,t2.nickname,t2.gender,t2.tel,t1.created_time from  (select member_id,created_time from tb_member_action  where article_id =? and action = ?) t1 inner join tb_member t2 on t1.member_id = t2.uuid ', [options.article_id, 'JOIN']);
  let rows = await P(pool, 'query', sql);
  return rows;

};

// 活动留言导出

let activityCommentExport = async function (options) {
  let sql = queryFormat(' select t2.firstname,t2.surname,t2.nickname,t2.gender,t2.tel,t1.content,t1.created_time from  (select user_id,content,created_time from tb_article_comment  where article_id =? and user_type = ? and comment_level = ?) t1 inner join tb_member t2 on t1.user_id = t2.uuid ', [options.article_id, 'MEMBER', 'FIRST']);
  let rows = await P(pool, 'query', sql);
  return rows;

};


module.exports = {
  activityCreate: activityCreate,
  activityList: activityList,
  activityDetail: activityDetail,
  activityUserList: activityUserList,
  activityCommentList: activityCommentList,
  deleteReply: deleteReply,
  commentReply: commentReply,
  deleteComment: deleteComment,
  activityEdit: activityEdit,
  activityDelete: activityDelete,
  activityUserExport: activityUserExport,
  activityCommentExport: activityCommentExport
};
