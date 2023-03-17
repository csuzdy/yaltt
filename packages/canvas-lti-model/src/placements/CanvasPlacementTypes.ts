export const CanvasPlacementTypes = {
  account_navigation: "account_navigation",
  similarity_detection: "similarity_detection",
  assignment_edit: "assignment_edit",
  assignment_group_menu: "assignment_group_menu",
  assignment_index_menu: "assignment_index_menu",
  assignment_menu: "assignment_menu",
  assignment_selection: "assignment_selection",
  assignment_view: "assignment_view",
  collaboration: "collaboration",
  conference_selection: "conference_selection",
  course_assignments_menu: "course_assignments_menu",
  course_home_sub_navigation: "course_home_sub_navigation",
  course_navigation: "course_navigation",
  course_settings_sub_navigation: "course_settings_sub_navigation",
  discussion_topic_menu: "discussion_topic_menu",
  discussion_topic_index_menu: "discussion_topic_index_menu",
  editor_button: "editor_button",
  file_menu: "file_menu",
  file_index_menu: "file_index_menu",
  global_navigation: "global_navigation",
  homework_submission: "homework_submission",
  link_selection: "link_selection",
  migration_selection: "migration_selection",
  module_group_menu: "module_group_menu",
  module_index_menu: "module_index_menu",
  module_index_menu_modal: "module_index_menu_modal",
  module_menu: "module_menu",
  module_menu_modal: "module_menu_modal",
  post_grades: "post_grades",
  quiz_index_menu: "quiz_index_menu",
  quiz_menu: "quiz_menu",
  resource_selection: "resource_selection",
  submission_type_selection: "submission_type_selection",
  student_context_card: "student_context_card",
  tool_configuration: "tool_configuration",
  user_navigation: "user_navigation",
  wiki_index_menu: "wiki_index_menu",
  wiki_page_menu: "wiki_page_menu",
} as const;

export type CanvasPlacementType =
  typeof CanvasPlacementTypes[keyof typeof CanvasPlacementTypes];