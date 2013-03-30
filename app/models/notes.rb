class Notes < ActiveRecord::Base
  attr_accessible :note_text_what, :note_text_why, :task_priority, :user_id
end
