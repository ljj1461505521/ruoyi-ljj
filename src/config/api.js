import server from "./server";
import api from "@/config/api";

export default {
  //login:server.src+'/dev-api/login',//登录
  
  /* login */
  login:'/login',//登录
  getInfo:'/getInfo',//获取用户详细信息
  logout:'/logout',//退出方法
  captchaImage:'/captchaImage',//获取验证码
  /* login */

  /* menu */
  getRouters:'/getRouters',//获取路由
   /* menu */

   /* cstest */
   cstestList:'/cstest/cstest/list',
   cstest:'/cstest/cstest',
   cstestExport:'/cstest/cstest/export',
   /* cstest */
   
   /* monitor */
   monitorJobList:'/monitor/job/list',
   monitorJob:'/monitor/job',
   monitorJobExport:'/monitor/job/export',
   monitorChangeStatus:'/monitor/job/changeStatus',
   monitorRun:'/monitor/job/run',
   monitorJobLogList:'/monitor/jobLog/list',
   monitorJobLog:'/monitor/jobLog',
   monitorJobLogClean:'/monitor/jobLog/clean',
   monitorJobLogExport:'/monitor/jobLog/export',
   monitorLogininforList:'/monitor/logininfor/list',
   monitorLogininfor:'/monitor/logininfor',
   monitorLogininforClean:'/monitor/logininfor/clean',
   monitorLogininforExport:'/monitor/logininfor/export',
   monitorOnlineList:'/monitor/online/list',
   monitorOnline:'/monitor/online',
   monitorOperlogList:'/monitor/operlog/list',
   monitorOperlog:'/monitor/operlog',
   monitorOperlogClean:'/monitor/operlog/clean',
   monitorOperlogExport:'/monitor/operlog/export',
   monitorServer:'/monitor/server',
   /* monitor */

   /* system */
   systemDictList:'/system/dict/data/list',
   systemDict:'/system/dict/data',
   systemDictType:'/system/dict/data/type',
   systemDictExport:'/system/dict/data/export',
   systemTypeList:'/system/dict/type/list',
   systemType:'/system/dict/type',
   systemTypeClearCache:'/system/dict/type/clearCache',
   systemTypeExport:'/system/dict/type/export',
   systemTypeOptionselect:'/system/dict/type/optionselect',
   systemConfigList:'/system/config/list',
   systemConfig:'/system/config',
   systemConfigConfigKey:'/system/config/configKey',
   systemConfigClearCache:'/system/config/clearCache',
   systemConfigExport:'/system/config/export',
   systemDeptList:'/system/dept/list',// 查询部门列表
   systemDeptExclude:'/system/dept/list/exclude',// 查询部门列表（排除节点）
   systemDept:'/system/dept',// 查询部门详细  // 新增部门  // 修改部门  // 删除部门
   systemDeptTreeselect:'/system/dept/treeselect',// 查询部门下拉树结构
   systemDeptRoleDeptTreeselect:'/system/dept/roleDeptTreeselect',// 根据角色ID查询部门树结构
   systemMenuList:'/system/menu/list',// 查询菜单列表
   systemMenu:'/system/menu',// 查询菜单详细  // 新增菜单  // 修改菜单  // 删除菜单
   systemMenuTreeselect:'/system/menu/treeselect',// 查询菜单下拉树结构
   systemMenuRoleMenuTreeselect:'/system/menu/roleMenuTreeselect',// 根据角色ID查询菜单下拉树结构
   systemNoticeList:'/system/notice/list',// 查询公告列表
   systemNotice:'/system/notice',// 查询公告详细 // 新增公告  // 修改公告  // 删除公告
   systemPostList:'/system/post/list',// 查询岗位列表
   systemPost:'/system/post',// 查询岗位详细 // 新增岗位  // 修改岗位  // 删除岗位
   systemPostExport:'/system/post/export',// 导出岗位
   systemRoleList:'/system/role/list',// 查询角色列表
   systemRole:'/system/role',// 查询角色详细  // 新增角色  // 修改角色  // 删除角色
   systemRoleDataScope:'/system/role/dataScope',// 角色数据权限
   systemRoleChangeStatus:'/system/role/changeStatus',// 角色状态修改
   systemRoleExport:'/system/role/export',// 导出角色
   systemUserList:'/system/user/list',// 查询用户列表
   systemUser:'/system/user',// 查询用户详细  // 新增用户 // 修改用户  // 删除用户
   systemUserExport:'/system/user/export',// 导出用户
   systemUserResetPwd:'/system/user/resetPwd',// 用户密码重置
   systemUseChangeStatus:'/system/user/changeStatus',// 用户状态修改
   systemUseProfile:'/system/user/profile',// 查询用户个人信息  // 修改用户个人信息  
   systemUseProfileUpdatePwd:'/system/user/profile/updatePwd',// 用户密码重置
   systemUseProfileAvatar:'/system/user/profile/avatar',// 用户头像上传
   systemUseProfileImportTemplate:'/system/user/importTemplate',//下载用户导入模板
   toolGenList:'/tool/gen/list',// 查询生成表数据
   toolGendbList:'/tool/gen/db/list',// 查询db数据库列表
   toolGen:'/tool/gen',// 查询表详细信息 // 修改代码生成信息  // 删除表数据
   toolGenImportTable:'/tool/gen/importTable',// 导入表
   toolGenPreview:'/tool/gen/preview',// 预览生成代码
  /* system */
}
